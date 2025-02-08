from django.urls import path
from . import views

urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("users/<int:id>", views.UserCRUD.as_view(), name="users"),
]
