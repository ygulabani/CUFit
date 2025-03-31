from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.urls import path
from users.views import update_profile, get_user_profile
from users import views
from users.views import cufit_chatbot
from users.views.user_profile import update_exercise_difficulty


urlpatterns = [
    path("login/", views.login_view, name="login"),
    path("signup/", views.signup_view, name="signup"),
    path("users/<int:id>", views.UserCRUD.as_view(), name="users"),
    path("update-profile/", update_profile, name="update_profile"),
    path("get-profile/", get_user_profile, name="get_profile"),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path("chatbot/", cufit_chatbot, name="chatbot"),
    path("exercise-difficulty/", update_exercise_difficulty, name="exercise_difficulty"),
]
