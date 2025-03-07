from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    free_request_count = models.IntegerField(
        default=5,
        verbose_name="Free request count"
    )

    is_email_verified = models.BooleanField(
        default=False,
        verbose_name="Verified"
    )

    @property
    def effective_plan(self):
        """Returns the actual plan based on subscription status"""
        subscription = self.subscription.filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gt=timezone.now())
        ).order_by('-start_date').first()

        return subscription.plan if subscription else 0
