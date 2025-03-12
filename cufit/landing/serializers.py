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

class MealPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = MealPlan
        fields = '__all__'

class UserMealPlanSerializer(serializers.ModelSerializer):
    breakfast = MealPlanSerializer()
    lunch = MealPlanSerializer()
    dinner = MealPlanSerializer()

    class Meta:
        model = UserMealPlan
        fields = '__all__'