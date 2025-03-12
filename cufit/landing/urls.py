from django.urls import path, include
from django.shortcuts import render
from .views import diet_preference_view, dashboard_view, update_profile, get_user_profile, MealPlanViewSet
from . import views
from rest_framework.routers import DefaultRouter
from django.contrib import admin


router = DefaultRouter()
router.register(r'meals', MealPlanViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),  
    path('', include('landing.urls')),
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("users/<int:id>", views.UserCRUD.as_view(), name="users"),
    path("diet-preferences/", diet_preference_view, name="diet_preferences"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("dashboard/", lambda request: render(request, "landing/dashboard.html"), name="dashboard"),
    path("update-profile/", update_profile, name="update_profile"),
    path("get-profile/", get_user_profile, name="get_profile"),
]



