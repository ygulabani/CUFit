﻿from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from .models import Profile, Exercise, MasterWorkout, Meal
from django.contrib.auth import get_user_model

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response



User = get_user_model()  # This ensures Django uses CustomUser

def get_restricted_exercises(pain_and_injury):
    # restricted exercises based on pain and injury
    exercise_filters = {
        "Knees": [
            "Squats", "Lunges", "Jumping", "Box Jumps", "Leg Press", "Step-Ups", "Running",
            "Jump Squats", "Plyometric Training", "Wall Sits", "High Knees", "Burpees"
        ],
        "Back": [
            "Deadlifts", "Bent-over Rows", "Superman Exercise", "Good Mornings", "Barbell Rows",
            "Pull-ups", "Heavy Back Extensions", "Romanian Deadlifts", "Kettlebell Swings",
            "Cable Rows", "T-Bar Rows", "Lat Pulldowns"
        ],
        "Shoulders": [
            "Overhead Press", "Lateral Raises", "Upright Rows", "Dips", "Arnold Press",
            "Handstand Push-ups", "Behind-the-Neck Press", "Military Press", "Kettlebell Press",
            "Front Raises", "Cable Lateral Raises"
        ],
        "Ankles": [
            "Jump Rope", "Calf Raises", "Sprint Training", "Plyometrics", "Basketball Drills",
            "Explosive Jumps", "Box Jumps", "Hill Running", "Single-Leg Hops"
        ],
        "Hips": [
            "Deep Squats", "Hip Thrusts", "Leg Press", "Side Lunges", "Deadlifts",
            "Sumo Squats", "Bulgarian Split Squats", "Romanian Deadlifts", "Cossack Squats",
            "Box Step-Ups", "Glute Bridges", "Cable Kickbacks"
        ],
        "Neck": [
            "Neck Bridges", "Shrugs", "Overhead Press", "Weighted Neck Exercises",
            "Behind-the-Neck Press", "Barbell Shrugs", "Trap Bar Deadlifts"
        ],
        "Wrists": [
            "Push-ups", "Bench Press", "Front Squats", "Kettlebell Swings",
            "Pull-ups", "Planks", "Farmer's Walk", "Handstands"
        ],
        "Elbows": [
            "Triceps Dips", "Close-Grip Bench Press", "Skull Crushers", "Overhead Triceps Extension",
            "EZ Bar Curls", "Hammer Curls", "Wrist Curls"
        ]
    }

    restricted_exercises = []

    for injury in pain_and_injury:
        if injury in exercise_filters:
            restricted_exercises.extend(exercise_filters[injury])

    return list(set(restricted_exercises))  # Remove duplicates

def index(request):
    return render(request, "landing/index.html")  # Ensure 'landing/index.html' exists


def login_page(request):
    return render(request, "landing/login.html")  # Ensure 'landing/login.html' exists


def login_signup_view(request):
    if request.method == "POST":
        if "signup_submit" in request.POST:
            username = request.POST["username"]
            email = request.POST["email"]
            password1 = request.POST["password1"]
            password2 = request.POST["password2"]

            if password1 != password2:
                messages.error(request, "Passwords do not match!")
            elif User.objects.filter(username=username).exists():
                messages.error(request, "Username already taken!")
            else:
                user = User.objects.create_user(
                    username=username, email=email, password=password1
                )
                Profile.objects.create(user=user)  # Create profile for the user
                messages.success(request, "Signup successful! Please log in.")

        elif "login_submit" in request.POST:
            username = request.POST["username"]
            password = request.POST["password"]
            user = authenticate(request, username=username, password=password)

            if user is not None:
                login(request, user)

                # Ensure user has a profile
                if not hasattr(user, "profile"):
                    Profile.objects.create(user=user)

                # Redirect to diet preferences if not set
                if not user.profile.diet_preference:
                    return redirect("diet_preferences")

                return redirect(
                    "dashboard"
                )  # Redirect to dashboard after setting preference
            else:
                messages.error(request, "Incorrect username or password.")

    return render(request, "landing/login.html")


def logout_view(request):
    logout(request)
    return redirect("login")


@login_required
def dashboard(request):
    return render(request, "dashboard.html")


@login_required
def diet_preference_view(request):
    return render(request, "landing/preferences.html")  # Ensure this template exists


@login_required
def diet_preference_view(request):
    if request.method == "POST":
        preference = request.POST.get("preference")
        if preference:
            request.user.profile.diet_preference = preference
            request.user.profile.save()
            messages.success(request, "Diet preference saved successfully!")
            return redirect(
                "dashboard"
            )  # Redirect to the main page after setting preference

    return render(
        request, "landing/preferences.html"
    )  # Show the preference selection page


@login_required
def dashboard_view(request):
    return render(request, "landing/dashboard.html")


from django.contrib.auth import login, authenticate
from .serializers import UserSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from rest_framework.views import APIView

User = get_user_model()


@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([permissions.AllowAny])
def signup_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        if User.objects.filter(email=serializer.validated_data["email"]).exists():
            return Response(
                {"email": "User with this email already exists"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = serializer.save()

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response(
            {
                "message": "Signup successful",
                "access token": access_token,
                "refresh token": str(refresh),
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    user = authenticate(username=username, password=password)

    if user is None:
        return Response(
            {"message": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)

    return Response(
        {
            "message": "login successful",
            "access_token": access_token,
            "refresh": str(refresh),
        },
        status=status.HTTP_200_OK,
    )


class UserCRUD(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, id):
        users = User.objects.get(id=id)
        serializer = UserSerializer(users)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
            serializer = UserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(
                    {"message": "User updated successfully"}, status=status.HTTP_200_OK
                )
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return Response(
                {"message": "User deleted successfully"},
                status=status.HTTP_204_NO_CONTENT,
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_404_NOT_FOUND
            )


from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Profile
from django.contrib.auth.decorators import login_required
from rest_framework.permissions import IsAuthenticated


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    profile.rest_days = request.data.get("rest_days", profile.rest_days)
    profile.bmi = request.data.get("bmi", profile.bmi)
    profile.goal_selection = request.data.get("goal_selection", profile.goal_selection)
    profile.diet_selection = request.data.get("diet_selection", profile.diet_selection)
    profile.diet_preference = request.data.get(
        "diet_preference", profile.diet_preference
    )
    profile.cooking_time_preference = request.data.get("cooking_time_preference", profile.cooking_time_preference)
    profile.meal_plan_selection = request.data.get(
        "meal_plan_selection", profile.meal_plan_selection
    )
    profile.meal_plan = request.data.get("meal_plan", profile.meal_plan)
    profile.activity_level = request.data.get("activity_level", profile.activity_level)
    profile.exercise_routine = request.data.get(
        "exercise_routine", profile.exercise_routine
    )
    profile.pain_and_injury = request.data.get(
        "pain_and_injury", profile.pain_and_injury
    )

    profile.save()

    return Response({"message": "Profile updated successfully!"}, status=200)


from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Profile

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_exercise_routine(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    if "pain_and_injury" in request.data:
        profile.pain_and_injury = request.data["pain_and_injury"]
        
        # Get restricted exercises
        restricted_exercises = get_restricted_exercises(profile.pain_and_injury)

        # Update profile with restricted exercises
        profile.exercise_routine = ", ".join(restricted_exercises)
        profile.save()

    return Response({
        "message": "Exercise routine updated successfully!",
        "restricted_exercises": get_restricted_exercises(profile.pain_and_injury)
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensures only authenticated users can access
def get_user_profile(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
        data = {
            "username": user.username,
            "goal_selection": profile.goal_selection or "Not selected",
            "diet_selection": profile.diet_selection or "Not selected",
            "diet_preference": profile.diet_preference or "Not selected",
            "cooking_time_preference": profile.cooking_time_preference or "Not selected",
            "meal_plan_selection": profile.meal_plan_selection or "Not selected",
            "meal_plan": profile.meal_plan or "Not selected",
            "activity_level": profile.activity_level or "Not selected",
            "exercise_routine": profile.exercise_routine or "Not selected",
            "pain_and_injury": profile.pain_and_injury or "Not selected",
        }
        return Response(data, status=200)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)



from .serializers import MealSerializer, ExerciseSerializer, MasterWorkoutSerializer, MealPlanSerializer

# GET API to fetch meals around campus
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meals(request):
    meals = Meal.objects.all()
    serializer = MealSerializer(meals, many=True)
    return Response({"meals": serializer.data})

# GET API to fetch exercise database
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercises(request):
    pain_and_injury = request.query_params.getlist('pain_and_injury', [])

    if pain_and_injury:
        restricted_exercises = get_restricted_exercises(pain_and_injury)
        exercises = Exercise.objects.filter(name__in=restricted_exercises)
    else:
        exercises = Exercise.objects.all()

    serializer = ExerciseSerializer(exercises, many=True)
    return Response({"exercises": serializer.data})

# GET API for master workout page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_master_workout(request):
    pain_and_injury = request.query_params.getlist('pain_and_injury', [])

    if pain_and_injury:
        restricted_exercises = get_restricted_exercises(pain_and_injury)
        workouts = MasterWorkout.objects.filter(name__in=restricted_exercises)
    else:
        workouts = MasterWorkout.objects.all()
    
    serializer = MasterWorkoutSerializer(workouts, many=True)
    return Response({"workout_master": serializer.data})


from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import MealPlan
from .serializers import MealPlanSerializer

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [AllowAny]  # ✅ Must be a LIST, not a single class


from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Profile, MealPlan, UserMealPlan
from .serializers import MealPlanSerializer, UserMealPlanSerializer

class MatchMealPlanViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # ✅ Allow access without authentication

    def list(self, request):
        if not request.user.is_authenticated:
            # ✅ Return some default meals for unauthenticated users
            default_meals = MealPlan.objects.all()[:5]  # Show first 5 meals
            serializer = MealPlanSerializer(default_meals, many=True)
            return Response(serializer.data)

        try:
            profile = Profile.objects.get(user=request.user)

            # Get user's preferences
            user_diet_selection = profile.diet_selection
            user_goal_selection = profile.goal_selection

            # Filter meals based on user preferences
            matching_meals = MealPlan.objects.filter(
                diet_type=user_diet_selection,
                goal_selection=user_goal_selection
            )

            # Create UserMealPlan for the user
            user_meal_plan, created = UserMealPlan.objects.get_or_create(user=request.user)
            if created and matching_meals.exists():
                user_meal_plan.breakfast = matching_meals.first()
                user_meal_plan.save()

            # Serialize and return response
            serializer = UserMealPlanSerializer(user_meal_plan)
            return Response(serializer.data)

        except Profile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)



from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import MealPlan, Profile, UserMealPlan
import datetime

@csrf_exempt  # ✅ Disables CSRF protection (if needed)
def get_user_meal_plan(request):
    if request.method == "GET":
        try:
            user_id = request.GET.get('user_id', None)  
            date = request.GET.get('date', datetime.date.today())  # Default to today

            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)

            # Get user profile
            user_profile = get_object_or_404(Profile, user_id=user_id)

            # Fetch meals matching the user’s profile
            matching_meals = MealPlan.objects.filter(
                diet_selection=user_profile.diet_selection,
                diet_preference=user_profile.diet_preference,
                goal_selection=user_profile.goal_selection
            )

            # Get user's meal plan for the day
            user_meal_plan, created = UserMealPlan.objects.get_or_create(user_id=user_id, date=date)

            response_data = {
                "breakfast": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.breakfast.all()],
                "lunch": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.lunch.all()],
                "dinner": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.dinner.all()],
                "snacks": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.snacks.all()]
            }

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)

from django.http import JsonResponse
from .models import UserMealPlan, MealPlan, Profile

def user_meal_plan(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"error": "Missing user_id"}, status=400)

    try:
        profile = Profile.objects.get(user__id=user_id)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)

    # Get meal plans based on user's profile
    meals = MealPlan.objects.filter(
        goal_selection=profile.goal_selection,
        diet_type=profile.diet_selection,
        diet_preference=profile.diet_preference
    ).values()

    return JsonResponse({"meals": list(meals)}, safe=False)



