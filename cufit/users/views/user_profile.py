from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from users.models import Profile, EXERCISE_DIFFICULTY_CHOICES, CustomUser

from rest_framework.decorators import (
    api_view,
    permission_classes,
    authentication_classes,
)
from rest_framework import permissions
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.response import Response
from users.serializers import UserSerializer
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated

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
                "access_token": access_token,
                "refresh_token": str(refresh),
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
    profile.exercise_difficulty = request.data.get(
        "exercise_difficulty", profile.exercise_difficulty
    )

    profile.save()

    return Response({"message": "Profile updated successfully!"}, status=200)


@api_view(["GET"])
@permission_classes([IsAuthenticated])  # Ensures only authenticated users can access
def get_user_profile(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
        # try:
        #     custom_user = CustomUser.objects.get(user=user)
        #     selected_plan_id = custom_user.selected_plan_id
        #     customer_id = custom_user.customer_id
        # except CustomUser.DoesNotExist:
        #     selected_plan_id = None
        #     customer_id = None

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
            "bmi": profile.bmi or "Not selected",
            "exercise_difficulty": profile.exercise_difficulty or "Not selected",
            # "selected_plan_id": selected_plan_id,
            # "customer_id": customer_id
        }
        return Response(data, status=200)
    except Profile.DoesNotExist:
        return Response({"error": "Profile not found"}, status=404)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_exercise_difficulty(request):
    user = request.user
    try:
        profile = Profile.objects.get(user=user)
        difficulty = request.data.get("difficulty")
        
        if not difficulty:
            return Response(
                {"error": "Difficulty level is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        valid_difficulties = [choice[0] for choice in EXERCISE_DIFFICULTY_CHOICES]
        if difficulty not in valid_difficulties:
            return Response(
                {"error": "Invalid difficulty level"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        profile.exercise_difficulty = difficulty
        profile.save()
        
        return Response(
            {"message": "Exercise difficulty updated successfully!"}, 
            status=status.HTTP_200_OK
        )
    except Profile.DoesNotExist:
        return Response(
            {"error": "Profile not found"}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
