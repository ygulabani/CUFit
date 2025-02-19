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
