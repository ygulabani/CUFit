from django.db import models
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