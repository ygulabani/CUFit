from django.contrib import admin
from .models import Profile, MealPlan

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('user',)  # Customize based on Profile fields

@admin.register(MealPlan)
class MealPlanAdmin(admin.ModelAdmin):
    list_display = ('meal_id', 'meal_type', 'diet_type', 'cooking_time', 'diet_selected')
    list_filter = ('diet_type', 'meal_type', 'diet_selected')
