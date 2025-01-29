from .models import Subscription
from rest_framework import serializers


class SubscriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Subscription
        fields = [
            'subscription_id',
            'product_name',
            'price',
            'interval',
            'start_date',
            'end_date',
            'is_active'
        ]
