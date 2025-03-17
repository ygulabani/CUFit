from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path, include
from django.shortcuts import render
from .views import diet_preference_view, dashboard_view, update_profile, get_user_profile
from . import views
from rest_framework.routers import DefaultRouter
from .views import MealPlanViewSet
from landing.views import update_exercise_routine
from .views import MatchMealPlanViewSet
from .views import get_user_meal_plan

router = DefaultRouter()
router.register(r'meals', MealPlanViewSet)
router.register(r'match-meals', MatchMealPlanViewSet, basename='match-meals')

urlpatterns = [
    path('', include(router.urls)),
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("users/<int:id>", views.UserCRUD.as_view(), name="users"),
    path("diet-preferences/", diet_preference_view, name="diet_preferences"),
    path("dashboard/", dashboard_view, name="dashboard"),
    path("dashboard/", lambda request: render(request, "landing/dashboard.html"), name="dashboard"),
    path("update-profile/", update_profile, name="update_profile"),
    path("get-profile/", get_user_profile, name="get_profile"),
    path('meal/', views.get_meals, name='get_meals'),
    path('exercises/', views.get_exercises, name='get_exercises'),
    path('exercises-master/', views.get_master_workout, name='get_master_workout'),
    path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("update-exercise-routine/", update_exercise_routine, name="update_exercise_routine"),
    path('api/user-meal-plan/', get_user_meal_plan, name='user_meal_plan'),
]
