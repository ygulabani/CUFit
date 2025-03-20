from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MealPlanViewSet, get_user_meal_plan

# Initialize the router
router = DefaultRouter()
router.register(r'meals', MealPlanViewSet)

# Define URL patterns
urlpatterns = [
    path('', include(router.urls)),  # Includes all router-based views
    path('api/user-meal-plan/', get_user_meal_plan, name='user_meal_plan'),  # Fetch user's meal plan
]
