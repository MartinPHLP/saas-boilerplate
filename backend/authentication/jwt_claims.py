from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        if user.is_staff:
            token['plan'] = 3

        else:
            token['plan'] = user.effective_plan

        subscription = user.subscription.filter(cancelled_at__isnull=True).first()
        token['subscription_id'] = subscription.subscription_id if subscription else None

        return token
