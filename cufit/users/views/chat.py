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
from meals.models import Meal
from workout.models import Exercise

# Load API key from .env file
load_dotenv()
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY")

# Define chatbot state
class AgentState(TypedDict):
    messages: Annotated[list, add_messages]
    finished: bool

# System instructions for the chatbot
CUFIT_BOT_SYSINT = (
    "system",
    " you can answer hello and thanks"
    "You are CUFITBot, an AI assistant that helps users with fitness, meal plans, and workouts. "
    "Only provide information from CUFIT's database. "
    "You can retrieve meals, workouts, and exercise details for users. If a user asks for a workout suggestion, call the 'get_exercises' tool with the correct difficulty level (Beginner, Intermediate, or Advanced)."
    "Avoid any off-topic discussions. If asked something unrelated, politely decline."
)

WELCOME_MSG = "Welcome to CUFITBot! 💪 How can I assist you today with your fitness journey?"

# ✅ Custom tools to fetch data from CUFIT's database
@tool
def get_meals() -> str:
    """Fetches all available meals from the database."""
    meals = Meal.objects.all().values()
    return list(meals) if meals else "No meals available."

@tool
def get_exercises(difficulty: str = "Beginner") -> str:
    """Fetches a recommended workout plan based on difficulty level."""
    try:
        difficulty = difficulty.strip().capitalize()  # ✅ Ensure correct format
        
        # Fetch exercises based on difficulty
        exercises = list(Exercise.objects.filter(difficulty__iexact=difficulty).order_by("?")[:5].values("name", "difficulty"))

        if not exercises:
            return f"No {difficulty} workouts available in the database."

        print(f"DEBUG: {difficulty} Exercises fetched ->", exercises)  # ✅ Check in terminal

        workout_list = "\n".join([f"- {exercise['name']} ({exercise['difficulty']})" for exercise in exercises])
        return f"Here is a {difficulty} workout plan:\n{workout_list}"

    except Exception as e:
        print("DEBUG: Error fetching exercises ->", str(e))  # ✅ Show error in Django console
        return f"Error fetching {difficulty} workout plan: {str(e)}"

# Define chatbot logic
def maybe_route_to_tools(state: AgentState) -> Literal["tools", "chatbot", "__end__"]:
    """Routes to the tools node if a tool call is required."""
    msgs = state["messages"]
    msg = msgs[-1]

    if hasattr(msg, "tool_calls") and len(msg.tool_calls) > 0:
        return "tools"
    else:
        return END

def chatbot(state: AgentState) -> AgentState:
    """Handles chatbot logic."""
    defaults = {"finished": False}

    if state["messages"]:
        new_output = llm_with_tools.invoke([CUFIT_BOT_SYSINT] + state["messages"])
    else:
        new_output = AIMessage(content=WELCOME_MSG)

    return defaults | state | {"messages": [new_output]}

# Setup tools and chatbot graph
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

# ✅ API Endpoint for Chatbot
@csrf_exempt
def cufit_chatbot(request):
    if request.method == "POST":
        data = json.loads(request.body)
        user_message = data.get("message", "")

        if not user_message:
            return JsonResponse({"error": "No message provided"}, status=400)

        state = chat_graph.invoke({"messages": [{"role": "user", "content": user_message}]})
        bot_reply = state["messages"][-1].content if hasattr(state["messages"][-1], "content") else "Sorry, I couldn't generate a response."

        return JsonResponse({"reply": bot_reply})

    return JsonResponse({"error": "Invalid request method"}, status=405)