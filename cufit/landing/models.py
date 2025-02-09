from django.contrib.auth.models import AbstractUser
from django.db import models
from django.conf import settings

class CustomUser(AbstractUser):
    phone_number = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.username

class Profile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    diet_preference = models.CharField(
        max_length=20,
        choices=[
            ("Vegetarian", "Vegetarian"),
            ("Non-Vegetarian", "Non-Vegetarian"),
            ("Vegan", "Vegan"),
            ("Mediterranean", "Mediterranean")
        ],
        default="Vegetarian"
    )
