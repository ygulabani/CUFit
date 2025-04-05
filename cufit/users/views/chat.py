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

# Load API key from .env
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Define chatbot state
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    finished: bool

# System instructions
BASE_SYSTEM_INSTRUCTIONS = (
    "system",
    "You are CUFITBot, an AI assistant that helps users with fitness, meal plans, and workouts. "
    "Only provide information from CUFIT's database. "
    "Always use the user's profile data to personalize answers. "
    "Use 'get_meals' with their diet, diet preference, and meal type. "
    "Use 'get_exercises' based on their preferred difficulty and impact level. "
    "Avoid any off-topic discussion and never access other users' data."
)

WELCOME_MSG = "Welcome to CUFITBot! 💪 How can I assist you today with your fitness journey?"

# Tool: Get Meals
@tool
def get_meals(
    diet_selection: str = None,
    diet_preference: str = None,
    meal_type: str = None  # like "breakfast,lunch,snacks"
) -> str:
    """
    Fetch personalized meals based on the user's diet, preference, and meal types (supports multiple).
    """
    try:
        if not meal_type:
            return "Meal type is missing. Please update your preferences."

        meal_types = [mt.strip() for mt in meal_type.split(",")]
        response = ""

        for mtype in meal_types:
            filters = {
                "diet_selection": diet_selection,
                "diet_preference": diet_preference,
                "meal_type": mtype,
            }

            print(f"🔍 Fetching {mtype} with filters:", filters)
            meals = list(MealPlan.objects.filter(**filters).values("name", "meal_type", "calories", "protein")[:5])

            if meals:
                response += f"\n🍽️ *{mtype.capitalize()} suggestions:*\n"
                for meal in meals:
                    response += f"- {meal['name']} ({meal['calories']} calories, {meal['protein']} protein)\n"
            else:
                response += f"\n⚠️ No {mtype} meals found for your preferences.\n"

        return response.strip()

    except Exception as e:
        return f"Error fetching meals: {str(e)}"

# Tool: Get Exercises
@tool
def get_exercises(difficulty: str = "Beginner", impact_level: str = "Low") -> str:
    """
    Get workouts based on difficulty and impact level.
    """
    try:
        exercises = list(ExerciseLibrary.objects.filter(
            difficulty__iexact=difficulty.strip().capitalize(),
            impact_level__iexact=impact_level.strip().capitalize()
        ).values("name", "body_part", "difficulty", "impact_level", "instructions")[:5])

        if not exercises:
            return "No matching exercises found."

        return "\n".join([
            f"- {ex['name']} ({ex['body_part']}, {ex['difficulty']}, {ex['impact_level']})\nInstructions: {ex['instructions']}"
            for ex in exercises
        ])

    except Exception as e:
        return f"Error fetching exercises: {str(e)}"

# Logic to route tool calls
def maybe_route_to_tools(state: AgentState) -> Literal["tools", "chatbot", "__end__"]:
    msg = state["messages"][-1]
    return "tools" if hasattr(msg, "tool_calls") and msg.tool_calls else END

# Main chatbot logic
def chatbot(state: AgentState) -> AgentState:
    defaults = {"finished": False}
    new_output = (
        llm_with_tools.invoke([BASE_SYSTEM_INSTRUCTIONS] + state["messages"])
        if state["messages"]
        else AIMessage(content=WELCOME_MSG)
    )
    return defaults | state | {"messages": [new_output]}

# Graph definition
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

# API Endpoint
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def cufit_chatbot(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)

        # Debug
        print("🤖 USER PROFILE DEBUG:")
        print("Diet Selection:", profile.diet_selection)
        print("Diet Preference:", profile.diet_preference)
        print("Meal Plan Selection (Type):", profile.meal_plan_selection)
        print("Exercise Difficulty:", profile.exercise_difficulty)
        print("Stretching Preference (impact level low?):", profile.stretching_preference)

        data = json.loads(request.body)
        user_message = data.get("message", "")
        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)

        # Personalized context
        profile_info = f"""
You are talking to {user.first_name or user.username}.
Diet: {profile.diet_selection}
Diet Preference: {profile.diet_preference}
Meal Type: {profile.meal_plan_selection}
Workout Difficulty: {profile.exercise_difficulty or "Beginner"}
Impact Level: {"Low" if profile.stretching_preference else "High"}
"""

        personalized_sys_msg = ("system", BASE_SYSTEM_INSTRUCTIONS[1] + "\n\n" + profile_info)

        # Run graph loop until END state
        inputs = {
            "messages": [
                personalized_sys_msg,
                {"role": "user", "content": user_message}
            ],
            "diet_selection": profile.diet_selection,
            "diet_preference": profile.diet_preference,
            "meal_type": profile.meal_plan_selection,
            "difficulty": profile.exercise_difficulty or "Beginner",
            "impact_level": "Low" if profile.stretching_preference else "High"
        }

        # Loop through graph using stream()
        final_state = None
        for state in chat_graph.stream(inputs):
            final_state = state

        # Final bot reply
        if "chatbot" in final_state and "messages" in final_state["chatbot"]:
          last_message = final_state["chatbot"]["messages"][-1]
          bot_reply = getattr(last_message, "content", "Sorry, I couldn't generate a response.")
        else:
           print("⚠️ No messages returned in final state:", final_state)
           bot_reply = "Sorry, I couldn't generate a response."

        return JsonResponse({"reply": bot_reply})
 
    except Profile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)
    # except Exception as e:
    #     return JsonResponse({"error": str(e)}, status=500)
    except Exception as e:
        import traceback
        print("🔥 FULL ERROR TRACEBACK:")
        traceback.print_exc()
        return JsonResponse({"error": str(e)}, status=500)
