from rest_framework import serializers
from .models import MealPlan, UserMealPlan, Meal



class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = '__all__'

class UserMealPlanSerializer(serializers.ModelSerializer):
    meal_details = MealPlanSerializer(source='breakfast', read_only=True)

    class Meta:
        model = UserMealPlan
        fields = ['date', 'meal_details']

class MealSerializer(serializers.ModelSerializer):
    class Meta:
        model = Meal
        fields = '__all__'