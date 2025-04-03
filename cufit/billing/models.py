from django.db import models


# Create your models here.
class Plan(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=10, default="usd")
    interval = models.CharField(max_length=10, default="month")
    product_id = models.CharField(max_length=255, unique=True)
    price_id = models.CharField(max_length=255, unique=True)

    def __str__(self):
        return self.name


class Subscription(models.Model):
    subscription_id = models.CharField(max_length=255, unique=True)
    status = models.CharField(max_length=20, default="inactive")
    plan_id = models.ForeignKey(Plan, on_delete=models.CASCADE, related_name="subscriptions")

    def __str__(self):
        return self.subscription_id


class Payment(models.Model):
    payment_intent = models.CharField(max_length=255, unique=True)
    subscription_id = models.ForeignKey(Subscription, on_delete=models.CASCADE, related_name="payments", null=True, blank=True)
    amount = models.IntegerField()
    status = models.CharField(max_length=20, default="pending")
    currency = models.CharField(max_length=10)

    def __str__(self):
        return self.payment_intent
