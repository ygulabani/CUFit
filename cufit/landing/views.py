﻿from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from .models import Profile
from django.contrib.auth import get_user_model


User = get_user_model()  # This ensures Django uses CustomUser


def index(request):
    return render(request, 'landing/index.html')  # Ensure 'landing/index.html' exists

def login_page(request):
    return render(request, 'landing/login.html')  # Ensure 'landing/login.html' exists

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
                user = User.objects.create_user(username=username, email=email, password=password1)
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

                return redirect("dashboard")  # Redirect to dashboard after setting preference
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
    return render(request, 'landing/preferences.html')  # Ensure this template exists

@login_required
def diet_preference_view(request):
    if request.method == "POST":
        preference = request.POST.get("preference")
        if preference:
            request.user.profile.diet_preference = preference
            request.user.profile.save()
            messages.success(request, "Diet preference saved successfully!")
            return redirect("dashboard")  # Redirect to the main page after setting preference

    return render(request, "landing/preferences.html")  # Show the preference selection page

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
def signup_view(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        if User.objects.filter(email=serializer.validated_data["email"]).exists():
            return Response(
                {"email": ["User with this email already exists"]},
                status=status.HTTP_400_BAD_REQUEST
            )
        user = serializer.save()
        login(request, user)
        return Response(
            {"message": "Signup successful"}, status=status.HTTP_201_CREATED
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if not username or not password:
        return Response(
            {"error": "Username and password are required"},
            status=status.HTTP_400_BAD_REQUEST,
        )

    user = authenticate(request, username=username, password=password)
    if user:
        login(request, user)
        return Response({"message": "Login successful"}, status=status.HTTP_200_OK)
    else:
        return Response(
            {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
        )

class UserCRUD(APIView):
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
                return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, id):
        try:
            user = User.objects.get(id=id)
            user.delete()
            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)