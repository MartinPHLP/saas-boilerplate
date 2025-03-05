from django.db import models
from django.utils.timezone import now
from authentication.models import User


class Subscription(models.Model):
    PLAN_CHOICES = [
        (1, 'Starter'),
        (2, 'Pro'),
        (3, 'Enterprise'),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='subscription'
    )
    customer_id = models.CharField(max_length=255)
    subscription_id = models.CharField(max_length=255, unique=True)
    product_name = models.CharField(max_length=255)
    plan = models.IntegerField(choices=PLAN_CHOICES, default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    interval = models.CharField(max_length=50, default='month')
    start_date = models.DateTimeField(auto_now_add=True)
    end_date = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    @property
    def is_active(self):
        if self.end_date:
            if now() < self.end_date:
                return True
            else:
                return False
        else:
            return True

    def __str__(self):
        return f"{self.user.username} - {self.product_name} - Active: {self.is_active}"
