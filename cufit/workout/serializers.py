from rest_framework import serializers
from .models import Exercise, MasterWorkout



class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'


class MasterWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterWorkout
        fields = '__all__'