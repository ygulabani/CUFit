from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    goal_selection = models.CharField(max_length=50, blank=True, null=True)
    diet_selection = models.CharField(max_length=50, blank=True, null=True)
    diet_preference = models.CharField(max_length=50, blank=True, null=True)
    cooking_time = models.CharField(max_length=50, blank=True, null=True)
    meal_plan_selection = models.CharField(max_length=50, blank=True, null=True)
    meal_plan = models.TextField(blank=True, null=True)
    activity_level = models.CharField(max_length=50, blank=True, null=True)
    exercise_routine = models.TextField(blank=True, null=True)
    pain_and_injury = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.user.username} - Profile"

class MealPlan(models.Model):
    MEAL_TYPES = [
        ('breakfast', 'Breakfast'),
        ('lunch', 'Lunch'),
        ('dinner', 'Dinner'),
        ('snack', 'Snack'),
    ]

    DIET_TYPES = [
        ('vegan', 'Vegan'),
        ('vegetarian', 'Vegetarian'),
        ('keto', 'Keto'),
        ('paleo', 'Paleo'),
        ('standard', 'Standard'),
    ]

    meal_id = models.AutoField(primary_key=True)  # Unique ID
    diet_type = models.CharField(max_length=20, choices=DIET_TYPES)  # Type of Diet
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPES)  # Type of Meal
    recipe_link = models.URLField(max_length=500, blank=True, null=True)  # Link to Recipe
    instructions = models.TextField()  # Cooking Instructions
    diet_selected = models.BooleanField(default=False)  # Whether the meal is selected in the plan
    cooking_time = models.IntegerField(help_text="Cooking time in minutes")  # Cooking Time

    def __str__(self):
        return f"{self.get_meal_type_display()} - {self.get_diet_type_display()}"

class UserMealPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    breakfast = models.ForeignKey(MealPlan, related_name='breakfast_meals', on_delete=models.SET_NULL, null=True, blank=True)
    lunch = models.ForeignKey(MealPlan, related_name='lunch_meals', on_delete=models.SET_NULL, null=True, blank=True)
    dinner = models.ForeignKey(MealPlan, related_name='dinner_meals', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.date}"