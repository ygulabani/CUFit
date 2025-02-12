from django.urls import path
from .views import diet_preference_view, dashboard_view
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("users/<int:id>", views.UserCRUD.as_view(), name="users"),
     path("diet-preferences/", diet_preference_view, name="diet_preferences"),
    path("dashboard/", dashboard_view, name="dashboard"),
     path("dashboard/", lambda request: render(request, "landing/dashboard.html"), name="dashboard"),
]



