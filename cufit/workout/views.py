from .models import ExerciseLibrary, MasterWorkout, Equipment, WorkoutExercise
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
        exercises = ExerciseLibrary.objects.filter(impact_level="Low")
    elif len(pain_and_injury) == 1:
        exercises = ExerciseLibrary.objects.filter(impact_level__in=["Low", "Medium"])
    else:
        exercises = ExerciseLibrary.objects.all()

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
        activity_level = user_profile.activity_level.lower() if user_profile.activity_level else 'moderate'

        # Map activity level to difficulty and impact level
        activity_mapping = {
            'sedentary': {
                'difficulty': 'Beginner',
                'impact_levels': ['Low']
            },
            'light': {
                'difficulty': 'Beginner',
                'impact_levels': ['Low', 'Medium']
            },
            'moderate': {
                'difficulty': 'Intermediate',
                'impact_levels': ['Low', 'Medium']
            },
            'very': {
                'difficulty': 'Intermediate',
                'impact_levels': ['Low', 'Medium', 'High']
            },
            'extra': {
                'difficulty': 'Advanced',
                'impact_levels': ['Medium', 'High']
            },
            'athlete': {
                'difficulty': 'Advanced',
                'impact_levels': ['High']
            }
        }

        # Get difficulty and impact levels based on activity level
        exercise_filters = activity_mapping.get(activity_level, {
            'difficulty': 'Intermediate',  # Default difficulty
            'impact_levels': ['Low', 'Medium']  # Default impact levels
        })

        difficulty = exercise_filters['difficulty']
        impact_levels = exercise_filters['impact_levels']

        # Get exercises based on difficulty and impact level
        exercises = ExerciseLibrary.objects.filter(
            difficulty=difficulty,
            impact_level__in=impact_levels
        ).values(
            'id',
            'name',
            'body_part',
            'difficulty',
            'impact_level',
            'description',
            'duration',
            'sets',
            'reps',
            'video_link',
            'exercise_type',
            'instructions'
        ).order_by('impact_level', 'body_part')

        # If no exercises found, try to get exercises with adjusted filters
        if not exercises.exists():
            print(f"No exercises found for difficulty '{difficulty}' and impact levels {impact_levels}")
            
            # Try to find exercises with the same difficulty but any impact level
            exercises = ExerciseLibrary.objects.filter(
                difficulty=difficulty
            ).values(
                'id',
                'name',
                'body_part',
                'difficulty',
                'impact_level',
                'description',
                'duration',
                'sets',
                'reps',
                'video_link',
                'exercise_type',
                'instructions'
            ).order_by('impact_level', 'body_part')

            if not exercises.exists():
                print("No exercises found with current difficulty, trying all difficulties")
                # If still no exercises, get all exercises
                exercises = ExerciseLibrary.objects.all().values(
                    'id',
                    'name',
                    'body_part',
                    'difficulty',
                    'impact_level',
                    'description',
                    'duration',
                    'sets',
                    'reps',
                    'video_link',
                    'exercise_type',
                    'instructions'
                ).order_by('difficulty', 'impact_level', 'body_part')

        # Add default values for fields that might be missing
        def add_default_values(exercises):
            result = []
            for exercise in exercises:
                exercise_dict = dict(exercise)
                if 'description' not in exercise_dict or not exercise_dict['description']:
                    exercise_dict['description'] = f"Exercise targeting {exercise_dict.get('body_part', 'full body')}"
                if 'duration' not in exercise_dict or not exercise_dict['duration']:
                    exercise_dict['duration'] = 10  # Default duration in minutes
                if 'sets' not in exercise_dict or not exercise_dict['sets']:
                    exercise_dict['sets'] = 3  # Default sets
                if 'reps' not in exercise_dict or not exercise_dict['reps']:
                    exercise_dict['reps'] = 10  # Default reps
                if 'video_link' not in exercise_dict:
                    exercise_dict['video_link'] = None  # Default video link
                if 'instructions' not in exercise_dict or not exercise_dict['instructions']:
                    exercise_dict['instructions'] = f"Perform the exercise with proper form targeting {exercise_dict.get('body_part', 'full body')}"
                result.append(exercise_dict)
            return result

        processed_exercises = add_default_values(exercises)

        return Response({
            'exercises': processed_exercises,
            'filters_applied': {
                'difficulty': difficulty,
                'impact_levels': impact_levels,
                'activity_level': activity_level,
                'total_exercises_found': len(processed_exercises)
            }
        })

    except Profile.DoesNotExist:
        return Response(
            {'error': 'User profile not found. Please complete your profile first.'},
            status=404
        )
    except Exception as e:
        print(f"Error in get_user_workout: {str(e)}")
        return Response(
            {'error': str(e)},
            status=500
        )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    try:
        profile = Profile.objects.get(user=request.user)
        profile_data = {
            'diet_selection': profile.diet_selection,
            'activity_level': profile.activity_level,
            'diet_preference': profile.diet_preference,
            'cooking_time_preference': profile.cooking_time_preference,
            'goal_selection': profile.goal_selection,
            'stretching_preference': profile.stretching_preference,
            'bmi': profile.bmi,
            'meal_plan_selection': profile.meal_plan_selection,
            'pain_and_injury': profile.pain_and_injury
        }
        return Response(profile_data)
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'},
            status=404
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=500
        )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_stretching_preference(request):
    try:
        user = request.user
        profile = Profile.objects.get(user=user)
        preference = request.data.get("stretching_preference")
        
        if preference is None:
            return Response(
                {"error": "Stretching preference is required"}, 
                status=400
            )
            
        profile.stretching_preference = preference
        profile.save()
        
        return Response(
            {"message": "Stretching preference updated successfully!"}, 
            status=200
        )
    except Profile.DoesNotExist:
        return Response(
            {"error": "Profile not found"}, 
            status=404
        )
    except Exception as e:
        return Response(
            {"error": str(e)}, 
            status=500
        )
