from django.contrib import admin
from .models import Profile, MealPlan

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)  # Customize based on Profile fields

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ['meal_id', 'meal_type', 'diet_selection', 'goal_selection']
    list_filter = ['diet_selection', 'goal_selection']