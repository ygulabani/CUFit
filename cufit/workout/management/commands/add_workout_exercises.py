from django.core.management.base import BaseCommand
from workout.models import WorkoutExercise

class Command(BaseCommand):
    help = 'Add sample workout exercises to the database'

    def handle(self, *args, **kwargs):
        exercises = [
            # Warm Up Exercises
            {
                'name': 'Light Jogging',
                'description': 'Start with a light jog to warm up your muscles and increase heart rate.',
                'exercise_type': 'Warm Up',
                'difficulty': 'Beginner',
                'duration': 5,
                'sets': 1,
                'reps': 1,
                'video_link': 'https://www.youtube.com/watch?v=example1'
            },
            {
                'name': 'Dynamic Stretching',
                'description': 'Perform dynamic stretches to prepare your muscles for exercise.',
                'exercise_type': 'Warm Up',
                'difficulty': 'Beginner',
                'duration': 5,
                'sets': 1,
                'reps': 10,
                'video_link': 'https://www.youtube.com/watch?v=example2'
            },
            {
                'name': 'Jump Rope',
                'description': 'Skip rope to increase heart rate and improve coordination.',
                'exercise_type': 'Warm Up',
                'difficulty': 'Intermediate',
                'duration': 5,
                'sets': 3,
                'reps': 50,
                'video_link': 'https://www.youtube.com/watch?v=example3'
            },
            {
                'name': 'High Knees',
                'description': 'Run in place while lifting knees high to warm up legs.',
                'exercise_type': 'Warm Up',
                'difficulty': 'Advanced',
                'duration': 5,
                'sets': 4,
                'reps': 30,
                'video_link': 'https://www.youtube.com/watch?v=example4'
            },

            # Main Exercises - Beginner
            {
                'name': 'Bodyweight Squats',
                'description': 'Basic squats using only your body weight.',
                'exercise_type': 'Main Exercise',
                'difficulty': 'Beginner',
                'duration': 10,
                'sets': 3,
                'reps': 10,
                'video_link': 'https://www.youtube.com/watch?v=example5'
            },
            {
                'name': 'Push-ups on Knees',
                'description': 'Modified push-ups performed with knees on the ground.',
                'exercise_type': 'Main Exercise',
                'difficulty': 'Beginner',
                'duration': 10,
                'sets': 3,
                'reps': 8,
                'video_link': 'https://www.youtube.com/watch?v=example6'
            },

            # Main Exercises - Intermediate
            {
                'name': 'Regular Push-ups',
                'description': 'Standard push-ups with proper form.',
                'exercise_type': 'Main Exercise',
                'difficulty': 'Intermediate',
                'duration': 15,
                'sets': 4,
                'reps': 12,
                'video_link': 'https://www.youtube.com/watch?v=example7'
            },
            {
                'name': 'Dumbbell Rows',
                'description': 'Single-arm rows using dumbbells.',
                'exercise_type': 'Main Exercise',
                'difficulty': 'Intermediate',
                'duration': 15,
                'sets': 3,
                'reps': 12,
                'video_link': 'https://www.youtube.com/watch?v=example8'
            },

            # Main Exercises - Advanced
            {
                'name': 'Plyometric Push-ups',
                'description': 'Explosive push-ups with hands leaving the ground.',
                'exercise_type': 'Main Exercise',
                'difficulty': 'Advanced',
                'duration': 20,
                'sets': 4,
                'reps': 15,
                'video_link': 'https://www.youtube.com/watch?v=example9'
            },
            {
                'name': 'Weighted Pull-ups',
                'description': 'Pull-ups with added weight for increased difficulty.',
                'exercise_type': 'Main Exercise',
                'difficulty': 'Advanced',
                'duration': 20,
                'sets': 4,
                'reps': 8,
                'video_link': 'https://www.youtube.com/watch?v=example10'
            },

            # Cool Down Exercises
            {
                'name': 'Static Stretching',
                'description': 'Hold stretches to cool down and improve flexibility.',
                'exercise_type': 'Cool Down',
                'difficulty': 'Beginner',
                'duration': 10,
                'sets': 1,
                'reps': 1,
                'video_link': 'https://www.youtube.com/watch?v=example11'
            },
            {
                'name': 'Light Walking',
                'description': 'Walk at a comfortable pace to gradually lower heart rate.',
                'exercise_type': 'Cool Down',
                'difficulty': 'Beginner',
                'duration': 5,
                'sets': 1,
                'reps': 1,
                'video_link': 'https://www.youtube.com/watch?v=example12'
            },
            {
                'name': 'Yoga Cool Down',
                'description': 'Basic yoga poses to relax muscles and improve flexibility.',
                'exercise_type': 'Cool Down',
                'difficulty': 'Intermediate',
                'duration': 10,
                'sets': 1,
                'reps': 1,
                'video_link': 'https://www.youtube.com/watch?v=example13'
            },
            {
                'name': 'Foam Rolling',
                'description': 'Use a foam roller for myofascial release and recovery.',
                'exercise_type': 'Cool Down',
                'difficulty': 'Advanced',
                'duration': 15,
                'sets': 1,
                'reps': 1,
                'video_link': 'https://www.youtube.com/watch?v=example14'
            },
        ]

        for exercise_data in exercises:
            WorkoutExercise.objects.get_or_create(**exercise_data)

        self.stdout.write(self.style.SUCCESS('Successfully added workout exercises')) 