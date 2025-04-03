from django.shortcuts import render
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

import stripe
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status

from .models import Plan, Payment, Subscription
from .serializers import PlanSerializer
from users.models import CustomUser

stripe.api_key = settings.STRIPE_SECRET_KEY


# Create your views here.
class PlanListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        plans = Plan.objects.all()
        serializer = PlanSerializer(plans, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class CheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            plan_name = request.data.get("plan_name")
            plan = Plan.objects.get(name=plan_name)

            user_name = request.user
            user = CustomUser.objects.get(username=user_name)
            customer = stripe.Customer.create(email=user.email)

            user.selected_plan = plan
            user.customer_id = customer.id
            user.save()

            session = stripe.checkout.Session.create(
                payment_method_types=["card"],
                customer=customer.id,
                line_items=[
                    {
                        "price": plan.price_id,
                        "quantity": 1,
                    }
                ],
                mode="subscription",
                success_url=request.build_absolute_uri("/billing/plans/"),
                cancel_url=request.build_absolute_uri("/billing/"),
            )

            return Response({"session_url": session.url}, status=status.HTTP_200_OK)

        except Plan.DoesNotExist:
            return Response(
                {"error": "Plan not found"}, status=status.HTTP_404_NOT_FOUND
            )


class StripeWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        payload = request.body
        sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
        endpoint_secret = settings.WEBHOOK_SECRET

        try:
            event = stripe.Webhook.construct_event(payload.decode('utf-8'), sig_header, endpoint_secret)
        except stripe.error.SignatureVerificationError as e:
            return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)

        if event["type"] == "checkout.session.completed":
            session = event["data"]["object"]
            subscription_id = session["subscription"]

            subscription = stripe.Subscription.retrieve(subscription_id)
            price_id = subscription["items"]["data"][0]["price"]["id"]
            plan = Plan.objects.get(price_id=price_id)

            subscription_instance = Subscription.objects.create(
                subscription_id=subscription_id,
                status=subscription.status,
                plan_id=plan,
            )

            invoice_id = session["invoice"]
            invoice = stripe.Invoice.retrieve(invoice_id)
            payment_intent = invoice["payment_intent"]
            payment = stripe.PaymentIntent.retrieve(payment_intent)

            Payment.objects.create(
                payment_intent=payment_intent,
                subscription_id=subscription_instance,
                amount=payment.amount_received,
                status=payment.status,
                currency=payment.currency,
            )

            return Response({"status": "success"}, status=status.HTTP_200_OK)
        

        return Response({"error": "Invalid event"}, status=status.HTTP_400_BAD_REQUEST)
