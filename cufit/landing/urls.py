from django.urls import path
from django.shortcuts import render
from .views import diet_preference_view, dashboard_view, update_profile, get_user_profile
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("users/<int:id>", views.UserCRUD.as_view(), name="users"),
    path("diet-preferences/", diet_preference_view, name="diet_preferences"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("dashboard/", lambda request: render(request, "landing/dashboard.html"), name="dashboard"),
    path("update-profile/", update_profile, name="update_profile"),
    path("get-profile/", get_user_profile, name="get_profile"),
    path('meals/', views.get_meals, name='get_meals'),
    path('exercises/', views.get_exercises, name='get_exercises'),
    path('exercises-master/', views.get_master_workout, name='get_master_workout'),
]


