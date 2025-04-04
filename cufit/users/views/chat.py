from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import os
from dotenv import load_dotenv
from langgraph.graph.message import add_messages
from langgraph.graph import StateGraph, START, END
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages.ai import AIMessage
from langchain_core.tools import tool
from langgraph.prebuilt import ToolNode
from typing import Annotated, Literal, TypedDict

from meals.models import MealPlan
from workout.models import ExerciseLibrary
from users.models import Profile
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

# Load API key
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# 🧠 Define chatbot state
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    finished: bool

# 📣 Static system instructions
BASE_SYSTEM_INSTRUCTIONS = (
    "system",
    "You are CUFITBot, an AI assistant that helps users with fitness, meal plans, and workouts. "
    "Only provide information from CUFIT's database. "
    "You must only call 'get_meals' using the provided 'diet_selection', 'goal_selection', and 'diet_preference' values. "
    "You can retrieve meals, workouts, and exercise details for users. "
    "If a user asks for a workout suggestion, call the 'get_exercises' tool with the correct difficulty level "
    "(Beginner, Intermediate, or Advanced). "
    "Avoid any off-topic discussions. If asked something unrelated, politely decline. "
    "Do not reveal or access any other user's data under any circumstance."
)

WELCOME_MSG = "Welcome to CUFITBot! 💪 How can I assist you today with your fitness journey?"

# ✅ Custom tools
@tool
def get_meals(
    diet_selection: str = None,
    diet_preference: str = None,
    meal_type: str = None
) -> str:
    """
    Fetch personalized meals based on the user's diet, preference, and meal type.
    """
    try:
        filters = {}
        if diet_selection:
            filters["diet_selection"] = diet_selection
        if diet_preference:
            filters["diet_preference"] = diet_preference
        if meal_type:
            filters["meal_type"] = meal_type

        print("🔍 Meal filters passed to DB query:", filters)

        meals = list(MealPlan.objects.filter(**filters).values("name", "meal_type", "calories")[:5])
        if not meals:
            return "No meals found based on your preferences."

        response = "Here are some meal suggestions:\n"
        for meal in meals:
            response += f"- {meal['name']} ({meal['meal_type']}, {meal['calories']} cal)\n\n"
        return response.strip()

    except Exception as e:
        return f"Error fetching meals: {str(e)}"

@tool
def get_exercises(difficulty: str = "Beginner", impact_level: str = "Low") -> str:
    """Fetch personalized workouts based on difficulty and impact level."""
    try:
        exercises = list(ExerciseLibrary.objects.filter(
            difficulty__iexact=difficulty.strip().capitalize(),
            impact_level__iexact=impact_level.strip().capitalize()
        ).values("name", "body_part", "difficulty", "impact_level", "instructions")[:5])

        if not exercises:
            return "No matching exercises found for your profile."

        response = "Here are some exercises:\n"
        for ex in exercises:
            response += f"- {ex['name']} ({ex['body_part']}, {ex['difficulty']}, {ex['impact_level']})\nInstructions: {ex['instructions']}\n\n"
        return response.strip()

    except Exception as e:
        return f"Error fetching exercises: {str(e)}"

# 🔄 Routing logic
def maybe_route_to_tools(state: AgentState) -> Literal["tools", "chatbot", "__end__"]:
    msg = state["messages"][-1]
    if hasattr(msg, "tool_calls") and len(msg.tool_calls) > 0:
        return "tools"
    return END

def chatbot(state: AgentState) -> AgentState:
    defaults = {"finished": False}
    if state["messages"]:
        new_output = llm_with_tools.invoke([BASE_SYSTEM_INSTRUCTIONS] + state["messages"])
    else:
        new_output = AIMessage(content=WELCOME_MSG)
    return defaults | state | {"messages": [new_output]}

# 🔧 Set up tools and graph
tools = [get_meals, get_exercises]
tool_node = ToolNode(tools)
llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash-latest")
llm_with_tools = llm.bind_tools(tools)

graph_builder = StateGraph(AgentState)
graph_builder.add_node("chatbot", chatbot)
graph_builder.add_node("tools", tool_node)
graph_builder.add_conditional_edges("chatbot", maybe_route_to_tools, {"tools": "tools", END: END})
graph_builder.add_edge("tools", "chatbot")
graph_builder.add_edge(START, "chatbot")
chat_graph = graph_builder.compile()

# ✅ Personalized endpoint
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cufit_chatbot(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)

        print("🤖 USER PROFILE DEBUG:")
        print("Diet Selection:", profile.diet_selection)
        print("Goal:", profile.goal_selection)
        print("Diet Preference:", profile.diet_preference)
        data = json.loads(request.body)
        user_message = data.get("message", "")

        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)

        profile_info = f"""
You are talking to {user.first_name or user.username}.
Fitness goal: {profile.goal_selection}
Diet: {profile.diet_selection or "N/A"} / {profile.diet_preference or "N/A"}
Exercise level: {profile.exercise_difficulty or "Beginner"}
"""

        personalized_sys_msg = ("system", BASE_SYSTEM_INSTRUCTIONS[1] + "\n\n" + profile_info)

        state = chat_graph.invoke({
           "messages": [
               personalized_sys_msg,
               {"role": "user", "content": user_message}
            ],
            "diet_selection": profile.diet_selection,
            "diet_preference": profile.diet_preference,
            "meal_type": profile.meal_plan_selection
        })

        bot_reply = state["messages"][-1].content if hasattr(state["messages"][-1], "content") else "Sorry, I couldn't generate a response."
        return JsonResponse({"reply": bot_reply})

    except Profile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)



