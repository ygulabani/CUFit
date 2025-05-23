from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

from billing.models import Plan

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

# 💪 Exercise Difficulty Choices
EXERCISE_DIFFICULTY_CHOICES = [
    ("beginner", "Beginner"),
    ("intermediate", "Intermediate"),
    ("advanced", "Advanced"),
]

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)
    selected_plan = models.ForeignKey(Plan, on_delete=models.SET_NULL, null=True, blank=True)
    customer_id = models.CharField(max_length=50, blank=True, null=True)

    def str(self):
        return self.username
    

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    rest_days = models.TextField(blank=True, null=True)
    bmi = models.TextField(blank=True, null=True)
    goal_selection = models.CharField(max_length=50, choices=GOAL_SELECTION_CHOICES, blank=True, null=True)
    diet_selection = models.CharField(max_length=50, choices=DIET_SELECTION_CHOICES, blank=True, null=True)
    diet_preference = models.CharField(max_length=50, choices=DIET_PREFERENCE_CHOICES, blank=True, null=True)
    cooking_time_preference = models.CharField(max_length=10, choices=COOKING_TIME_CHOICES, blank=True, null=True)
    meal_plan_selection = models.CharField(max_length=50, blank=True, null=True)
    meal_plan = models.TextField(blank=True, null=True)
    activity_level = models.CharField(max_length=50, blank=True, null=True)
    exercise_routine = models.TextField(blank=True, null=True)
    pain_and_injury = models.TextField(blank=True, null=True)
    exercise_difficulty = models.CharField(max_length=20, choices=EXERCISE_DIFFICULTY_CHOICES, blank=True, null=True)
    stretching_preference = models.BooleanField(default=False)

    def str(self):
        return f"{self.user.username} - Profile"
