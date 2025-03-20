import datetime
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import MealPlan, UserMealPlan
from users.models import Profile
from rest_framework.response import Response
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import MealPlanSerializer, UserMealPlanSerializer
from django.db.models import Q
import random


class UserMealPlanViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]  # Ensuring only authenticated users access

    def list(self, request):
        try:
            # Get user profile
            profile = get_object_or_404(Profile, user=request.user)

            # Match meals based on user's preferences
            matching_meals = MealPlan.objects.filter(
                diet_type=profile.diet_selection,
                goal_selection=profile.goal_selection,
                diet_preference=profile.diet_preference
            )

            # Get or create UserMealPlan
            user_meal_plan, created = UserMealPlan.objects.get_or_create(user=request.user, date=datetime.date.today())

            if created and matching_meals.exists():
                user_meal_plan.breakfast.set(matching_meals[:1])
                user_meal_plan.lunch.set(matching_meals[1:2])
                user_meal_plan.dinner.set(matching_meals[2:3])
                user_meal_plan.snacks.set(matching_meals[3:4])
                user_meal_plan.save()

            # Serialize and return matched meals
            serializer = UserMealPlanSerializer(user_meal_plan)
            return Response(serializer.data)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


@csrf_exempt
def get_user_meal_plan(request):
    """ Fetch meal plan for a specific user based on profile preferences """
    if request.method == "GET":
        try:
            user_id = request.GET.get('user_id', None)
            date = request.GET.get('date', datetime.date.today())

            if not user_id:
                return JsonResponse({"error": "User ID is required"}, status=400)

            # Get user profile
            user_profile = get_object_or_404(Profile, user_id=user_id)

            # Get matched meals based on user's profile
            matched_meals = MealPlan.objects.filter(
                diet_selection=user_profile.diet_selection,
                diet_preference=user_profile.diet_preference,
                goal_selection=user_profile.goal_selection
            )

            # Fetch or create the user's meal plan for the given date
            user_meal_plan, created = UserMealPlan.objects.get_or_create(user_id=user_id, date=date)

            if created and matched_meals.exists():
                user_meal_plan.breakfast.set(matched_meals[:1])
                user_meal_plan.lunch.set(matched_meals[1:2])
                user_meal_plan.dinner.set(matched_meals[2:3])
                user_meal_plan.snacks.set(matched_meals[3:4])
                user_meal_plan.save()

            response_data = {
                "breakfast": [{"id": meal.id, "name": meal.name, "calories": meal.calories} for meal in user_meal_plan.breakfast.all()],
                "lunch": [{"id": meal.id, "name": meal.name, "calories": meal.calories} for meal in user_meal_plan.lunch.all()],
                "dinner": [{"id": meal.id, "name": meal.name, "calories": meal.calories} for meal in user_meal_plan.dinner.all()],
                "snacks": [{"id": meal.id, "name": meal.name, "calories": meal.calories} for meal in user_meal_plan.snacks.all()]
            }

            return JsonResponse(response_data, safe=False)

        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Invalid request method"}, status=405)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_meal_plan(request):
    try:
        # Get user's profile
        user_profile = get_object_or_404(Profile, user=request.user)
        
        # Get user preferences
        diet_preference = user_profile.diet_preference
        goal_selection = user_profile.goal_selection
        cooking_time = user_profile.cooking_time_preference
        
        # Base query to filter meals based on user preferences
        base_query = Q(
            diet_preference=diet_preference,
            goal_selection=goal_selection,
            cooking_time=cooking_time
        )
        
        # Get meals for each meal type
        def get_meals_for_type(meal_type, limit=3):
            meals = list(MealPlan.objects.filter(
                base_query,
                meal_type=meal_type
            ).values(
                'meal_id',
                'meal_type',
                'diet_preference',
                'goal_selection',
                'cooking_time',
                'calories',
                'protein',
                'carbs',
                'fat',
                'recipe_link',
                'instructions'
            ))
            
            # Randomly select meals up to the limit
            return random.sample(meals, min(len(meals), limit))
        
        # Get meals for each meal type
        meal_plan = {
            'breakfast': get_meals_for_type('breakfast'),
            'lunch': get_meals_for_type('lunch'),
            'dinner': get_meals_for_type('dinner'),
            'snacks': get_meals_for_type('snacks')
        }
        
        return Response(meal_plan)
        
    except Profile.DoesNotExist:
        return Response(
            {'error': 'User profile not found. Please complete your profile first.'},
            status=404
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )

from rest_framework import viewsets
from .models import MealPlan
from .serializers import MealPlanSerializer

class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
