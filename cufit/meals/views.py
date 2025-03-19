import datetime
from .serializers import MealPlanSerializer, UserMealPlanSerializer, MealSerializer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import get_object_or_404
from .models import Meal, MealPlan, UserMealPlan
from users.models import Profile

from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.decorators import (
    api_view,
    permission_classes,
)



class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
    permission_classes = [AllowAny]  # ✅ Must be a LIST, not a single class


class MatchMealPlanViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]  # ✅ Allow access without authentication

    def list(self, request):
        if not request.user.is_authenticated:
            # ✅ Return some default meals for unauthenticated users
            default_meals = MealPlan.objects.all()[:5]  # Show first 5 meals
            serializer = MealPlanSerializer(default_meals, many=True)
            return Response(serializer.data)

        try:
            profile = Profile.objects.get(user=request.user)

            # Get user's preferences
            user_diet_selection = profile.diet_selection
            user_goal_selection = profile.goal_selection

            # Filter meals based on user preferences
            matching_meals = MealPlan.objects.filter(
                diet_type=user_diet_selection,
                goal_selection=user_goal_selection
            )

            # Create UserMealPlan for the user
            user_meal_plan, created = UserMealPlan.objects.get_or_create(user=request.user)
            if created and matching_meals.exists():
                user_meal_plan.breakfast = matching_meals.first()
                user_meal_plan.save()

            # Serialize and return response
            serializer = UserMealPlanSerializer(user_meal_plan)
            return Response(serializer.data)

        except Profile.DoesNotExist:
            return Response({"error": "User profile not found"}, status=404)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@csrf_exempt  # ✅ Disables CSRF protection (if needed)
def get_user_meal_plan(request):
    if request.method == "GET":
        try:
            user_id = request.GET.get('user_id', None)  
            date = request.GET.get('date', datetime.date.today())  # Default to today

            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)

            # Get user profile
            user_profile = get_object_or_404(Profile, user_id=user_id)

            # Fetch meals matching the user’s profile
            matching_meals = MealPlan.objects.filter(
                diet_selection=user_profile.diet_selection,
                diet_preference=user_profile.diet_preference,
                goal_selection=user_profile.goal_selection
            )

            # Get user's meal plan for the day
            user_meal_plan, created = UserMealPlan.objects.get_or_create(user_id=user_id, date=date)

            response_data = {
                "breakfast": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.breakfast.all()],
                "lunch": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.lunch.all()],
                "dinner": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.dinner.all()],
                "snacks": [{"id": meal.meal_id, "name": str(meal), "calories": meal.calories} for meal in user_meal_plan.snacks.all()]
            }

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


def user_meal_plan(request):
    user_id = request.GET.get("user_id")

    if not user_id:
        return JsonResponse({"error": "Missing user_id"}, status=400)

    try:
        profile = Profile.objects.get(user__id=user_id)
    except Profile.DoesNotExist:
        return JsonResponse({"error": "User profile not found"}, status=404)

    # Get meal plans based on user's profile
    meals = MealPlan.objects.filter(
        goal_selection=profile.goal_selection,
        diet_type=profile.diet_selection,
        diet_preference=profile.diet_preference
    ).values()

    return JsonResponse({"meals": list(meals)}, safe=False)


# GET API to fetch meals around campus
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meals(request):
    meals = Meal.objects.all()
    serializer = MealSerializer(meals, many=True)
    return Response({"meals": serializer.data})