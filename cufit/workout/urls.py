from django.urls import path
from . import views
from .views import update_exercise_routine
from .views import save_equipment


urlpatterns = [
    path('exercises/', views.get_exercises, name='get_exercises'),
    path('exercises-master/', views.get_master_workout, name='get_master_workout'),
    path("update-exercise-routine/", update_exercise_routine, name="update_exercise_routine"),
    path('save-equipment/', save_equipment, name='save-equipment'),
]
