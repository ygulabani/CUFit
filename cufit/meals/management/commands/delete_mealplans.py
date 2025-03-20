from django.core.management.base import BaseCommand
from meals.models import MealPlan

class Command(BaseCommand):
    help = 'Delete meal plans within a specified ID range'

    def handle(self, *args, **options):
        try:
            # Delete meal plans with IDs from 202 to 212
            deleted_count = MealPlan.objects.filter(meal_id__range=(202, 212)).delete()[0]
            self.stdout.write(
                self.style.SUCCESS(f'Successfully deleted {deleted_count} meal plans')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error deleting meal plans: {str(e)}')
            ) 