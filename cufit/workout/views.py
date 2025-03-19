from .models import Exercise, MasterWorkout, Equipment
from users.models import Profile
from .serializers import ExerciseSerializer, MasterWorkoutSerializer

from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated



def get_restricted_exercises(pain_and_injury):
    # restricted exercises based on pain and injury
    exercise_filters = {
        "Knees": [
            "Squats", "Lunges", "Jumping", "Box Jumps", "Leg Press", "Step-Ups", "Running",
            "Jump Squats", "Plyometric Training", "Wall Sits", "High Knees", "Burpees"
        ],
        "Back": [
            "Deadlifts", "Bent-over Rows", "Superman Exercise", "Good Mornings", "Barbell Rows",
            "Pull-ups", "Heavy Back Extensions", "Romanian Deadlifts", "Kettlebell Swings",
            "Cable Rows", "T-Bar Rows", "Lat Pulldowns"
        ],
        "Shoulders": [
            "Overhead Press", "Lateral Raises", "Upright Rows", "Dips", "Arnold Press",
            "Handstand Push-ups", "Behind-the-Neck Press", "Military Press", "Kettlebell Press",
            "Front Raises", "Cable Lateral Raises"
        ],
        "Ankles": [
            "Jump Rope", "Calf Raises", "Sprint Training", "Plyometrics", "Basketball Drills",
            "Explosive Jumps", "Box Jumps", "Hill Running", "Single-Leg Hops"
        ],
        "Hips": [
            "Deep Squats", "Hip Thrusts", "Leg Press", "Side Lunges", "Deadlifts",
            "Sumo Squats", "Bulgarian Split Squats", "Romanian Deadlifts", "Cossack Squats",
            "Box Step-Ups", "Glute Bridges", "Cable Kickbacks"
        ],
        "Neck": [
            "Neck Bridges", "Shrugs", "Overhead Press", "Weighted Neck Exercises",
            "Behind-the-Neck Press", "Barbell Shrugs", "Trap Bar Deadlifts"
        ],
        "Wrists": [
            "Push-ups", "Bench Press", "Front Squats", "Kettlebell Swings",
            "Pull-ups", "Planks", "Farmer's Walk", "Handstands"
        ],
        "Elbows": [
            "Triceps Dips", "Close-Grip Bench Press", "Skull Crushers", "Overhead Triceps Extension",
            "EZ Bar Curls", "Hammer Curls", "Wrist Curls"
        ]
    }

    restricted_exercises = []

    for injury in pain_and_injury:
        if injury in exercise_filters:
            restricted_exercises.extend(exercise_filters[injury])

    return list(set(restricted_exercises))  # Remove duplicates


# GET API to fetch exercise database
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_exercises(request):
    pain_and_injury = request.query_params.getlist('pain_and_injury', [])

    if pain_and_injury:
        restricted_exercises = get_restricted_exercises(pain_and_injury)
        exercises = Exercise.objects.filter(name__in=restricted_exercises)
    else:
        exercises = Exercise.objects.all()

    serializer = ExerciseSerializer(exercises, many=True)
    return Response({"exercises": serializer.data})

# GET API for master workout page
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_master_workout(request):
    pain_and_injury = request.query_params.getlist('pain_and_injury', [])

    if pain_and_injury:
        restricted_exercises = get_restricted_exercises(pain_and_injury)
        workouts = MasterWorkout.objects.filter(name__in=restricted_exercises)
    else:
        workouts = MasterWorkout.objects.all()
    
    serializer = MasterWorkoutSerializer(workouts, many=True)
    return Response({"workout_master": serializer.data})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def update_exercise_routine(request):
    user = request.user
    profile, created = Profile.objects.get_or_create(user=user)

    if "pain_and_injury" in request.data:
        profile.pain_and_injury = request.data["pain_and_injury"]
        
        # Get restricted exercises
        restricted_exercises = get_restricted_exercises(profile.pain_and_injury)

        # Update profile with restricted exercises
        profile.exercise_routine = ", ".join(restricted_exercises)
        profile.save()

    return Response({
        "message": "Exercise routine updated successfully!",
        "restricted_exercises": get_restricted_exercises(profile.pain_and_injury)
    })



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

