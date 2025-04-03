from django.urls import path
from .views import PlanListView, CheckoutSessionView, StripeWebhookView

urlpatterns = [
    path("plans/", PlanListView.as_view(), name="get-plans"),
    path("checkout-session/", CheckoutSessionView.as_view(), name="checkout-session"),
    path("webhook/", StripeWebhookView.as_view(), name="webhook"),
]
