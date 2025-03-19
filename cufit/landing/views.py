from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import logout
from django.contrib.auth.decorators import login_required
from users.models import Profile



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
def dashboard_view(request):
    return render(request, "landing/dashboard.html")

def index(request):
    return render(request, "landing/index.html")


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


