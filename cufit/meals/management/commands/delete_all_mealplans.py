from django.core.management.base import BaseCommand
from meals.models import MealPlan

class Command(BaseCommand):
    help = 'Delete all meal plans from the database'

    def handle(self, *args, **options):
        try:
            # Get the count before deletion
            count = MealPlan.objects.all().count()
            
            # Delete all meal plans
            MealPlan.objects.all().delete()
            
            self.stdout.write(
                self.style.SUCCESS(f'Successfully deleted {count} meal plans')
            )
        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error deleting meal plans: {str(e)}')
            ) 