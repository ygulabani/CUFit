from django.core.management.base import BaseCommand
from meals.models import MealPlan
import random

class Command(BaseCommand):
    help = 'Add meal plans with various combinations'

    def handle(self, *args, **options):
        meal_types = ['breakfast', 'lunch', 'dinner', 'snacks']
        diet_selections = ['no-diet', 'keto', 'fasting', 'gluten-free', 'raw-food', 'bulking']
        diet_preferences = ['veg', 'non-veg', 'eggitarian', 'mediterranean', 'vegan', 'detox']
        cooking_times = [
            'Less than 10 minutes',
            '10 - 20 minutes',
            '20 - 30 minutes',
            '30 - 45 minutes',
            'More than 45 minutes'
        ]
        goal_selections = [
            "weight-loss", "muscle-gain", "get-lean", "maintain", "strength",
            "endurance", "flexibility", "sports", "body-recomp", "powerlifting",
            "calisthenics", "general-health"
        ]

        # Sample recipe instructions and links
        recipe_instructions = [
            "1. Preheat oven to 350°F\n2. Mix ingredients\n3. Bake for 20 minutes",
            "1. Chop vegetables\n2. Cook in pan\n3. Season to taste",
            "1. Boil water\n2. Add ingredients\n3. Simmer for 15 minutes",
            "1. Prepare ingredients\n2. Mix in bowl\n3. Serve fresh"
        ]

        recipe_links = [
            "https://example.com/recipe1",
            "https://example.com/recipe2",
            "https://example.com/recipe3",
            "https://example.com/recipe4"
        ]

        count = 0
        try:
            # Create meal plans with different combinations
            for meal_type in meal_types:
                for diet_selection in diet_selections:
                    for diet_preference in diet_preferences:
                        for cooking_time in cooking_times:
                            # Create multiple entries for each combination with different goals
                            for goal in goal_selections:
                                try:
                                    meal_plan = MealPlan(
                                        meal_type=meal_type,
                                        diet_selection=diet_selection,
                                        diet_preference=diet_preference,
                                        cooking_time=cooking_time,
                                        goal_selection=f"['{goal}']",  # Adding brackets without quotes
                                        calories=random.randint(200, 800),
                                        protein=round(random.uniform(10, 40), 1),
                                        carbs=round(random.uniform(20, 80), 1),
                                        fat=round(random.uniform(5, 30), 1),
                                        recipe_link=random.choice(recipe_links),
                                        instructions=random.choice(recipe_instructions),
                                        diet_selected=False
                                    )
                                    meal_plan.save()
                                    count += 1
                                    if count % 100 == 0:  # Print progress every 100 entries
                                        self.stdout.write(f'Created {count} meal plans...')
                                except Exception as e:
                                    self.stdout.write(
                                        self.style.WARNING(
                                            f'Error creating meal plan: {meal_type}, {diet_selection}, {diet_preference}, {cooking_time}, {goal}: {str(e)}'
                                        )
                                    )

            self.stdout.write(
                self.style.SUCCESS(f'Successfully created {count} meal plans')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating meal plans: {str(e)}')
            ) 