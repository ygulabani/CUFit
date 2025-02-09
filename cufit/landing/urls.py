from django.urls import path
from .views import login_signup_view, diet_preference_view, dashboard_view
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path("login/", login_signup_view, name="login"),
    path("diet-preferences/", diet_preference_view, name="diet_preferences"),
    path("dashboard/", dashboard_view, name="dashboard"),
     path("dashboard/", lambda request: render(request, "landing/dashboard.html"), name="dashboard"),

]



