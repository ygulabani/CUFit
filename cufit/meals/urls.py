from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import MealPlanViewSet
from .views import MatchMealPlanViewSet
from .views import get_user_meal_plan

router = DefaultRouter()
router.register(r'meals', MealPlanViewSet)
router.register(r'match-meals', MatchMealPlanViewSet, basename='match-meals')

urlpatterns = [
    path('', include(router.urls)),
    path('meal/', views.get_meals, name='get_meals'),
    path('api/', include(router.urls)),
    path('api/user-meal-plan/', get_user_meal_plan, name='user_meal_plan'),
]
