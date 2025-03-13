from rest_framework import serializers
from .models import CustomUser
from .models import MealPlan, UserMealPlan

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password"]

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"],
        )
        return user
    
    def update(self, instance, validated_data):
        """Update user and hash password if provided."""
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        instance.phone_number = validated_data.get('phone_number', instance.phone_number)
        
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])

        instance.save()
        return instance

from rest_framework import serializers
from .models import MealPlan, UserMealPlan

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = 'all'

class UserMealPlanSerializer(serializers.ModelSerializer):
    meal_details = MealPlanSerializer(source='breakfast', read_only=True)

    class Meta:
        model = UserMealPlan
        fields = ['date', 'meal_details']