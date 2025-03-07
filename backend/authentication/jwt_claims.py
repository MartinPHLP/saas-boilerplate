from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.db import models
from django.utils import timezone


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        subscription = user.subscription.filter(
            models.Q(end_date__isnull=True) | models.Q(end_date__gt=timezone.now())
        ).order_by('-start_date').first()
        username = user.username
        token['subscription_id'] = subscription.subscription_id if subscription else None
        token['username'] = username
        token['plan'] = subscription.plan if subscription else 0

        return token
