from rest_framework import serializers
from .models import ExerciseLibrary, MasterWorkout  



class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseLibrary  
        fields = '__all__'



class MasterWorkoutSerializer(serializers.ModelSerializer):
    class Meta:
        model = MasterWorkout
        fields = '__all__'
