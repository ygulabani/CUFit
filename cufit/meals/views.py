import datetime
from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from .models import MealPlan, UserMealPlan, Meal
from users.models import Profile
from rest_framework.response import Response
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes
from .serializers import MealPlanSerializer, UserMealPlanSerializer, MealSerializer
from django.db.models import Q
import random


class UserMealPlanViewSet(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

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


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_meal_plan(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)
        
        # Get user preferences
        diet_selection = profile.diet_selection
        diet_preference = profile.diet_preference
        cooking_time = profile.cooking_time_preference
        
        # Map cooking time preferences to model choices
        cooking_time_mapping = {
            '10-20 minutes': '10-20',
            '20-30 minutes': '20-30',
            '30-45 minutes': '30-45',
            '45+ minutes': '45+'
        }
        
        # Base query for meals
        base_query = Q(diet_selection=diet_selection) | Q(diet_preference=diet_preference)
        if cooking_time in cooking_time_mapping:
            base_query &= Q(cooking_time=cooking_time_mapping[cooking_time])
        
        # Get meals for each type
        meal_types = ['breakfast', 'lunch', 'dinner', 'snacks']
        meal_plan = {}
        
        for meal_type in meal_types:
            # Try to get meals matching all preferences
            meals = MealPlan.objects.filter(
                base_query,
                meal_type=meal_type
            ).order_by('?')[:3]  # Get up to 3 random meals
            
            # If no exact matches, try to get meals based on diet preferences only
            if not meals.exists():
                meals = MealPlan.objects.filter(
                    Q(diet_selection=diet_selection) | Q(diet_preference=diet_preference),
                    meal_type=meal_type
                ).order_by('?')[:3]
            
            meal_plan[meal_type] = list(meals.values())
        
        return Response(meal_plan)
        
    except Profile.DoesNotExist:
        return Response(
            {"error": "User profile not found. Please complete your profile setup."},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_meals(request):
    meals = Meal.objects.all()
    serializer = MealSerializer(meals, many=True)
    return Response({"meals": serializer.data})


class MealPlanViewSet(viewsets.ModelViewSet):
    queryset = MealPlan.objects.all()
    serializer_class = MealPlanSerializer
