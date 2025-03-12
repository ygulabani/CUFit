from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from .models import Profile
from django.contrib.auth import get_user_model

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication


User = get_user_model()  # This ensures Django uses CustomUser


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
@login_required
@permission_classes([IsAuthenticated])
def update_profile(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    profile.goal_selection = request.data.get("goal_selection", profile.goal_selection)
    profile.diet_selection = request.data.get("diet_selection", profile.diet_selection)
    profile.diet_preference = request.data.get(
        "diet_preference", profile.diet_preference
    )
    profile.cooking_time = request.data.get("cooking_time", profile.cooking_time)
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
from rest_framework.permissions import IsAuthenticated
from .models import Profile


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
            "cooking_time": profile.cooking_time or "Not selected",
            "meal_plan_selection": profile.meal_plan_selection or "Not selected",
            "meal_plan": profile.meal_plan or "Not selected",
            "activity_level": profile.activity_level or "Not selected",
            "exercise_routine": profile.exercise_routine or "Not selected",
            "pain_and_injury": profile.pain_and_injury or "Not selected",
        }
        return Response(data, status=200)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)



# Static JSON Data for Meals Around Campus 
meals_data = [
    {"id": 1, "name": "Veg Burger", "location": "Cafeteria", "price": 50},
    {"id": 2, "name": "Paneer Wrap", "location": "Food Court", "price": 80},
    {"id": 3, "name": "Fruit Salad", "location": "Healthy Bites", "price": 60},
]

# Static JSON Data for Exercise Database 
exercise_data = [
    {"id": 1, "name": "Push-ups", "body_part": "Chest", "difficulty": "Easy"},
    {"id": 2, "name": "Squats", "body_part": "Legs", "difficulty": "Medium"},
    {"id": 3, "name": "Plank", "body_part": "Core", "difficulty": "Hard"},
]

# Static JSON Data for Master Workout Page 
master_workout_data = [
    {"id": 1, "name": "Push-ups", "instructions": "Keep back straight", "video_url": "https://youtu.be/zkU6Ok44_CI?si=fOrqYSwMxqdFPLml"},
    {"id": 2, "name": "Squats", "instructions": "Keep knees behind toes", "video_url": "https://youtu.be/HFnSsLIB7a4?si=wYQlU0hMdu4nsszy"},
    {"id": 3, "name": "Plank", "instructions": "Hold position for 30s", "video_url": "https://youtu.be/_lfR4sl0ZCE?si=nWV4TprthQ3d6egh"},
]

# GET API to fetch meals around campus
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_meals(request):
    return Response({"meals": meals_data})

# GET API to fetch exercise database
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_exercises(request):
    return Response({"exercises": exercise_data})

# GET API for master workout page
@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def get_master_workout(request):
    return Response({"workout_master": master_workout_data})

from rest_framework import viewsets
from .models import MealPlan, UserMealPlan
from .serializers import MealPlanSerializer, UserMealPlanSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [AllowAny]



class UserMealPlanViewSet(viewsets.ModelViewSet):
    queryset = UserMealPlan.objects.all()
    serializer_class = UserMealPlanSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return UserMealPlan.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)