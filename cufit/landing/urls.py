from django.urls import path
from django.shortcuts import render
from .views import diet_preference_view, dashboard_view



urlpatterns = [
    path("diet-preferences/", diet_preference_view, name="diet_preferences"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("dashboard/", lambda request: render(request, "landing/dashboard.html"), name="dashboard"),
]
