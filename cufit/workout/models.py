from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    body_part = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    type = models.CharField(max_length=50, blank=True, null=True)  

    def __str__(self):
        return self.name

class MasterWorkout(models.Model):
    name = models.CharField(max_length=100)
    instructions = models.TextField()
    video_url = models.URLField()

    def __str__(self):
        return self.name

class Equipment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)  # Link to user
    equipment_name = models.CharField(max_length=255)  # Store equipment name

    def __str__(self):
        return f"{self.user.username} - {self.equipment_name}"

class WorkoutExercise(models.Model):
    EXERCISE_TYPES = [
        ('Warm Up', 'Warm Up'),
        ('Main Exercise', 'Main Exercise'),
        ('Cool Down', 'Cool Down'),
    ]

    DIFFICULTY_LEVELS = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    exercise_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField()
    exercise_type = models.CharField(max_length=20, choices=EXERCISE_TYPES)
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS)
    duration = models.IntegerField(help_text="Duration in minutes")
    sets = models.IntegerField()
    reps = models.IntegerField()
    video_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.difficulty})"