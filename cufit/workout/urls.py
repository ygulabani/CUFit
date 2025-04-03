from django.urls import path
from . import views

urlpatterns = [
    path('api/exercises/', views.get_exercises, name='get_exercises'),
    path('api/master-workouts/', views.get_master_workouts, name='get_master_workouts'),
    path('api/update-exercise-routine/', views.update_exercise_routine, name='update_exercise_routine'),
    path('api/save-equipment/', views.save_equipment, name='save_equipment'),
    path('api/user-workout/', views.get_user_workout, name='get_user_workout'),
    path('get-profile/', views.get_user_profile, name='get_user_profile'),
    path('api/update-stretching/', views.update_stretching_preference, name='update_stretching_preference'),
]
