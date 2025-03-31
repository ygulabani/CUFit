from .models import Exercise, MasterWorkout, Equipment, WorkoutExercise
from users.models import Profile
from .serializers import ExerciseSerializer, MasterWorkoutSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated


# GET API to fetch exercise database
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercises(request):
    pain_and_injury = request.query_params.getlist('pain_and_injury', [])

    if len(pain_and_injury) >= 2:
        exercises = Exercise.objects.filter(impact_level="Low")
    elif len(pain_and_injury) == 1:
        exercises = Exercise.objects.filter(impact_level__in=["Low", "Medium"])
    else:
        exercises = Exercise.objects.all()

    serializer = ExerciseSerializer(exercises, many=True)
    return Response({"exercises": serializer.data})


# GET API for master workout page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_master_workouts(request):
    workouts = MasterWorkout.objects.all()
    serializer = MasterWorkoutSerializer(workouts, many=True)
    return Response({"workout_master": serializer.data})



@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_exercise_routine(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    pain_and_injury = request.data.get("pain_and_injury", [])
    if isinstance(pain_and_injury, list):
        profile.pain_and_injury = pain_and_injury
        profile.save()

        return Response({
            "message": "User pain_and_injury updated successfully",
            "pain_and_injury": pain_and_injury
        })
    else:
        return Response({"error": "pain_and_injury must be a list"}, status=400)



@api_view(["POST"])
@permission_classes([IsAuthenticated])  # Ensure the user is logged in
def save_equipment(request):
    try:
        user = request.user  # Get the logged-in user
        selected_equipment = request.data.get("equipment", [])  # Get selected equipment

        # Save each equipment item to the database
        for item in selected_equipment:
            Equipment.objects.create(user=user, equipment_name=item)

        return Response({"message": "Equipment saved successfully!"}, status=201)
    
    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_workout(request):
    try:
        # Get user's profile
        user_profile = Profile.objects.get(user=request.user)
        activity_level = user_profile.activity_level.lower()

        # Determine difficulty based on activity level
        if activity_level in ['sedentary', 'light']:
            difficulty = 'Beginner'
        elif activity_level in ['moderate', 'very']:
            difficulty = 'Intermediate'
        else:  # extra or athlete
            difficulty = 'Advanced'

        # Get exercises based on difficulty
        warm_up = WorkoutExercise.objects.filter(
            difficulty=difficulty,
            exercise_type='Warm Up'
        ).values(
            'exercise_id',
            'name',
            'description',
            'duration',
            'difficulty',
            'sets',
            'reps',
            'video_link'
        )

        main_exercises = WorkoutExercise.objects.filter(
            difficulty=difficulty,
            exercise_type='Main Exercise'
        ).values(
            'exercise_id',
            'name',
            'description',
            'duration',
            'difficulty',
            'sets',
            'reps',
            'video_link'
        )

        cool_down = WorkoutExercise.objects.filter(
            difficulty=difficulty,
            exercise_type='Cool Down'
        ).values(
            'exercise_id',
            'name',
            'description',
            'duration',
            'difficulty',
            'sets',
            'reps',
            'video_link'
        )

        return Response({
            'warm_up': list(warm_up),
            'main_exercises': list(main_exercises),
            'cool_down': list(cool_down)
        })

    except Profile.DoesNotExist:
        return Response(
            {'error': 'User profile not found. Please complete your profile first.'},
            status=404
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        profile = Profile.objects.get(user=request.user)

        data = {
            "pain_and_injury": profile.pain_and_injury,
        }

        return Response(data)

    except Profile.DoesNotExist:
        return Response({"error": "User profile not found"}, status=404)
