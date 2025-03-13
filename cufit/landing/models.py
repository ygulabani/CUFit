from django.contrib.auth.models import AbstractUser
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

# 🥑 Diet Selection Choices
DIET_SELECTION_CHOICES = [
    ("no-diet", "No Diet at all"),
    ("keto", "Keto"),
    ("fasting", "Intermittent Fasting"),
    ("gluten-free", "Gluten Free"),
    ("raw-food", "Raw Food"),
    ("bulking", "Bulking"),
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

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def str(self):
        return self.username
class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    
    goal_selection = models.CharField(max_length=50, choices=GOAL_SELECTION_CHOICES, blank=True, null=True)
    diet_selection = models.CharField(max_length=50, choices=DIET_SELECTION_CHOICES, blank=True, null=True)
    diet_preference = models.CharField(max_length=50, choices=DIET_PREFERENCE_CHOICES, blank=True, null=True)
    cooking_time_preference = models.CharField(max_length=10, choices=COOKING_TIME_CHOICES, blank=True, null=True)
    meal_plan_selection = models.CharField(max_length=50, blank=True, null=True)
    meal_plan = models.TextField(blank=True, null=True)
    activity_level = models.CharField(max_length=50, blank=True, null=True)
    exercise_routine = models.TextField(blank=True, null=True)
    pain_and_injury = models.TextField(blank=True, null=True)

    def str(self):
        return f"{self.user.username} - Profile"

class MealPlan(models.Model):
    meal_id = models.AutoField(primary_key=True)  # Unique ID
    meal_type = models.CharField(max_length=20, choices=MEAL_TYPE_CHOICES)  # Type of Meal
    diet_selection = models.CharField(max_length=20, choices=DIET_SELECTION_CHOICES)  # Type of Diet
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