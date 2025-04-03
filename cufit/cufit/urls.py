from django.contrib import admin
from django.urls import include, path
from workout import views



urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("landing.urls")),
    path("", include("users.urls")), 
    path("meals/", include("meals.urls")),
    path("api/", include("workout.urls")),
    path('api/save-equipment/', views.save_equipment, name='save-equipment'),
    path("", include("workout.urls")),
    path("workout/", include("workout.urls")),



    
    path("billing/", include("billing.urls")),
]
