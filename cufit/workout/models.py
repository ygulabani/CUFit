from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    body_part = models.CharField(max_length=100)
    difficulty = models.CharField(max_length=50)
    type = models.CharField(max_length=50, blank=True, null=True)

    IMPACT_CHOICES = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    impact_level = models.CharField(max_length=10, choices=IMPACT_CHOICES, default='Medium')

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
        ('Strength', 'Strength'),
        ('Cardio', 'Cardio'),
        ('Core', 'Core'),
        ('Power', 'Power'),
        ('Plyometric', 'Plyometric'),
        ('Yoga', 'Yoga'),
    ]

    DIFFICULTY_LEVELS = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    IMPACT_LEVELS = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    exercise_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    body_part = models.CharField(max_length=100, default='Full Body')
    description = models.TextField(default='')
    exercise_type = models.CharField(max_length=20, choices=EXERCISE_TYPES, default='Main Exercise')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='Beginner')
    impact_level = models.CharField(max_length=10, choices=IMPACT_LEVELS, default='Medium')
    instructions = models.TextField(default='')
    duration = models.IntegerField(help_text="Duration in minutes", default=10)
    sets = models.IntegerField(default=3)
    reps = models.IntegerField(default=10)
    video_link = models.URLField(blank=True, null=True)

    def __str__(self):
        return f"{self.name} ({self.difficulty})"

class ExerciseLibrary(models.Model):
    EXERCISE_TYPES = [
        ('Strength', 'Strength'),
        ('Cardio', 'Cardio'),
        ('Core', 'Core'),
        ('Power', 'Power'),
        ('Plyometric', 'Plyometric'),
        ('Yoga', 'Yoga'),
    ]

    DIFFICULTY_LEVELS = [
        ('Beginner', 'Beginner'),
        ('Intermediate', 'Intermediate'),
        ('Advanced', 'Advanced'),
    ]

    IMPACT_LEVELS = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]

    BODY_PARTS = [
        ('Full Body', 'Full Body'),
        ('Chest', 'Chest'),
        ('Back', 'Back'),
        ('Legs', 'Legs'),
        ('Arms', 'Arms'),
        ('Shoulders', 'Shoulders'),
        ('Core', 'Core'),
        ('Glutes', 'Glutes'),
    ]

    name = models.CharField(max_length=100)
    body_part = models.CharField(max_length=50, choices=BODY_PARTS, default='Full Body')
    description = models.TextField(default='')
    exercise_type = models.CharField(max_length=20, choices=EXERCISE_TYPES, default='Strength')
    difficulty = models.CharField(max_length=20, choices=DIFFICULTY_LEVELS, default='Beginner')
    impact_level = models.CharField(max_length=10, choices=IMPACT_LEVELS, default='Medium')
    instructions = models.TextField(default='')
    duration = models.IntegerField(help_text="Duration in minutes", default=10)
    sets = models.IntegerField(default=3)
    reps = models.IntegerField(default=10)
    video_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Exercise Library"
        verbose_name_plural = "Exercise Library"
        ordering = ['name']

    def __str__(self):
        return f"{self.name} ({self.difficulty})"