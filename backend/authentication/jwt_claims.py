from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        subscription = user.subscription.filter(cancelled_at__isnull=True).first()
        username = user.username
        token['subscription_id'] = subscription.subscription_id if subscription else None
        token['username'] = username

        return token
