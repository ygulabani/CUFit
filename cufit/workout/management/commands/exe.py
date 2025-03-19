from django.core.management.base import BaseCommand
from workout.models import MasterWorkout


class Command(BaseCommand):
    help = "Insert restaurant data into the database"

    def handle(self, *args, **kwargs):
        data = [
            {
                "id": 1,
                "name": "Push-ups",
                "instructions": "Keep back straight",
                "video_url": "https://youtu.be/zkU6Ok44_CI?si=fOrqYSwMxqdFPLml",
            },
            {
                "id": 2,
                "name": "Squats",
                "instructions": "Keep knees behind toes",
                "video_url": "https://youtu.be/HFnSsLIB7a4?si=wYQlU0hMdu4nsszy",
            },
            {
                "id": 3,
                "name": "Plank",
                "instructions": "Hold position for 30s",
                "video_url": "https://youtu.be/_lfR4sl0ZCE?si=nWV4TprthQ3d6egh",
            },
            {
                "id": 4,
                "name": "Lunges",
                "instructions": "Keep your upper body straight",
                "video_url": "https://youtu.be/QOVaHwm-Q6U",
            },
            {
                "id": 5,
                "name": "Jumping",
                "instructions": "Land softly on your feet",
                "video_url": "https://youtu.be/AEMHRtLCpB8",
            },
            {
                "id": 6,
                "name": "Box Jumps",
                "instructions": "Use your arms to generate momentum",
                "video_url": "https://youtu.be/52r_Ul0HMi4",
            },
            {
                "id": 7,
                "name": "Leg Press",
                "instructions": "Don't lock your knees at the top",
                "video_url": "https://youtu.be/IZxyjW7MPJQ",
            },
            {
                "id": 8,
                "name": "Step-Ups",
                "instructions": "Push through your heel",
                "video_url": "https://youtu.be/39dbQGkSpA8",
            },
            {
                "id": 9,
                "name": "Running",
                "instructions": "Maintain an upright posture",
                "video_url": "https://youtu.be/bcY_10VaLNQ",
            },
            {
                "id": 10,
                "name": "Jump Squats",
                "instructions": "Explode upwards with power",
                "video_url": "https://youtu.be/A1zB6Z2n6rE",
            },
            {
                "id": 11,
                "name": "Plyometric Training",
                "instructions": "Focus on explosive movements",
                "video_url": "https://youtu.be/kDq1NwZhhMM",
            },
            {
                "id": 12,
                "name": "Wall Sits",
                "instructions": "Keep your back against the wall",
                "video_url": "https://youtu.be/-cdph8hv0O0",
            },
            {
                "id": 13,
                "name": "High Knees",
                "instructions": "Bring knees to waist level",
                "video_url": "https://youtu.be/1BZMUbZCRbc",
            },
            {
                "id": 14,
                "name": "Burpees",
                "instructions": "Explode upwards with a jump",
                "video_url": "https://youtu.be/qLBImHhCXSw",
            },
        ]

        for item in data:
            MasterWorkout.objects.create(**item)

        self.stdout.write(self.style.SUCCESS("Successfully inserted restaurant data"))
