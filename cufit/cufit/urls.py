from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("landing.urls")),
    path("", include("users.urls")), 
    path("", include("meals.urls")),
    path("", include("workout.urls")),
]
