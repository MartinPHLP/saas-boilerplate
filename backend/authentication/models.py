from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    PLAN_CHOICES = [
        (1, 'Free'),
        (2, 'Premium'),
        (3, 'Pro'),
    ]

    plan = models.IntegerField(
        choices=PLAN_CHOICES,
        default=1,
        verbose_name="Plan"
    )

    is_email_verified = models.BooleanField(
        default=False,
        verbose_name="Verified"
    )
