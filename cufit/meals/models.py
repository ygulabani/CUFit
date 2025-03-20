from django.db import models
from django.conf import settings

# 🍳 Cooking Time Choices
COOKING_TIME_CHOICES = [
    ("<10", "Less than 10 minutes"),
    ("10-20", "10 - 20 minutes"),
    ("20-30", "20 - 30 minutes"),
    ("30-45", "30 - 45 minutes"),
    (">45", "More than 45 minutes"),
]

# 🏋️ Goal Selection Choices
GOAL_SELECTION_CHOICES = [
    ("weight-loss", "Lose Weight"),
    ("muscle-gain", "Build Muscle"),
    ("get-lean", "Get Lean"),
    ("maintain", "Maintain Fitness"),
    ("strength", "Increase Strength"),
    ("endurance", "Build Endurance"),
    ("flexibility", "Improve Flexibility"),
    ("sports", "Sports Performance"),
    ("body-recomp", "Body Recomposition"),
    ("powerlifting", "Powerlifting"),
    ("calisthenics", "Calisthenics"),
    ("general-health", "General Health"),
]

# 🥦 Diet Preference Choices
DIET_PREFERENCE_CHOICES = [
    ("veg", "Vegetarian"),
    ("non-veg", "Non-Vegetarian"),
    ("eggitarian", "Eggitarian"),
    ("mediterranean", "Mediterranean"),
    ("vegan", "Vegan"),
    ("detox", "Detox Diet"),
]

# 🍽️ Meal Type Choices
MEAL_TYPE_CHOICES = [
    ("breakfast", "Breakfast"),
    ("snacks", "Snacks"),
    ("lunch", "Lunch"),
    ("dinner", "Dinner"),
]

# Create your models here.
class MealPlan(models.Model):
    meal_id = models.AutoField(primary_key=True)  # Unique ID
    name = models.CharField(max_length=100, null=True, blank=True)  # Name of the meal
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)  # Type of Meal
    diet_selection = models.CharField(max_length=100, default='default_diet')
    diet_preference = models.CharField(max_length=20, choices=DIET_PREFERENCE_CHOICES, blank=True, null=True)  # ✅ NEW FIELD
    goal_selection = models.CharField(max_length=50, choices=GOAL_SELECTION_CHOICES, blank=True, null=True)
    cooking_time = models.CharField(max_length=10, choices=COOKING_TIME_CHOICES)  # Cooking Time
    calories = models.IntegerField(default=0)  # ✅ NEW FIELD
    protein = models.FloatField(default=0.0)  # ✅ NEW FIELD
    carbs = models.FloatField(default=0.0)  # ✅ NEW FIELD
    fat = models.FloatField(default=0.0)  # ✅ NEW FIELD
    recipe_link = models.URLField(max_length=500, blank=True, null=True)  # Link to Recipe
    instructions = models.TextField()  # Cooking Instructions
    diet_selected = models.BooleanField(default=False)  # Whether the meal is selected in the plan

    def str(self):
        return f"{self.get_meal_type_display()} - {self.get_diet_selection_display()}"


class UserMealPlan(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()
    breakfast = models.ManyToManyField(MealPlan, related_name='breakfast_meals', blank=True)  # ✅ Now ManyToMany
    lunch = models.ManyToManyField(MealPlan, related_name='lunch_meals', blank=True)  # ✅ Now ManyToMany
    dinner = models.ManyToManyField(MealPlan, related_name='dinner_meals', blank=True)  # ✅ Now ManyToMany
    snacks = models.ManyToManyField(MealPlan, related_name='snack_meals', blank=True)  # ✅ Added snacks

    def str(self):
        return f"{self.user.username} - {self.date}"
    
    
class Meal(models.Model):
    name = models.CharField(max_length=100)
    location = models.CharField(max_length=100)
    price = models.IntegerField()
    url = models.URLField(max_length=500, blank=True, null=True)

    def __str__(self):
        return self.name