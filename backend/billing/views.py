import stripe

from django.db import models
from datetime import datetime
from .models import Subscription
from django.conf import settings
from rest_framework import status
from django.utils import timezone
from django.utils.timezone import now
from authentication.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .serializers import SubscriptionSerializer
from rest_framework.permissions import IsAuthenticated
from authentication.jwt_claims import CustomTokenObtainPairSerializer
from core.settings import FRONTEND_URL, STRIPE_SECRET_KEY_TEST, STRIPE_STARTER_PRICE_ID, STRIPE_PRO_PRICE_ID, STRIPE_ENTERPRISE_PRICE_ID


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stripe.api_key = STRIPE_SECRET_KEY_TEST
        user = request.user
        plan_id = request.data.get('plan_id')

        if not plan_id or plan_id not in [1, 2, 3]:
            return Response(
                {'error': 'Invalid plan id'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            subscription = user.subscription.filter(
                models.Q(end_date__isnull=True) | models.Q(end_date__gt=timezone.now())
            ).order_by('-start_date').first()

            if not subscription:
                customer = stripe.Customer.create(
                    email=user.email,
                    metadata={'user_id': str(user.id)}
                )
                customer_id = customer.id

            else:
                customer_id = subscription.customer_id

            price_id = {
                1: STRIPE_STARTER_PRICE_ID,
                2: STRIPE_PRO_PRICE_ID,
                3: STRIPE_ENTERPRISE_PRICE_ID,
            }[plan_id]

            checkout_session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f'{FRONTEND_URL}/subscription-success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{FRONTEND_URL}/subscription-cancel?session_id={{CHECKOUT_SESSION_ID}}',
                metadata={
                    'user_id': str(user.id),
                    'customer_id': customer_id,
                    'plan': str(plan_id)
                }
            )

            return Response({
                'checkout_url': checkout_session.url,
                'session_id': checkout_session.id
            })

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CreateSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stripe.api_key = settings.STRIPE_SECRET_KEY_TEST
        session_id = request.data.get('session_id')

        if not session_id:
            return Response(
                {'error': 'Session ID is required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        session = stripe.checkout.Session.retrieve(session_id)
        user_id = session.metadata.get('user_id')
        user = User.objects.get(id=user_id)

        # Check for existing active subscription without end_date
        existing_subscription = user.subscription.filter(
            end_date__isnull=True
        ).first()

        if existing_subscription:
            # Cancel the existing subscription in Stripe
            stripe.Subscription.modify(
                existing_subscription.subscription_id,
                cancel_at_period_end=True
            )

            # Update our database
            stripe_sub = stripe.Subscription.retrieve(existing_subscription.subscription_id)
            existing_subscription.cancelled_at = now()
            existing_subscription.end_date = timezone.make_aware(
                datetime.fromtimestamp(stripe_sub['current_period_end'])
            )
            existing_subscription.save()

        # Create new subscription
        subscription = stripe.Subscription.retrieve(session.subscription)
        price = subscription['items']['data'][0]['price']
        product_id = price['product']
        product = stripe.Product.retrieve(product_id)

        subscription_obj, created = Subscription.objects.get_or_create(
            user=user,
            customer_id=session.customer,
            subscription_id=session.subscription,
            product_name=product.name,
            plan=session.metadata.get('plan'),
            price=price['unit_amount'] / 100,
            interval=price['recurring']['interval'],
            start_date=timezone.make_aware(
                datetime.fromtimestamp(subscription['current_period_start'])
            )
        )

        token = CustomTokenObtainPairSerializer.get_token(user)
        return Response({
            'token': str(token.access_token),
            'message': 'Subscription created successfully'
        }, status=status.HTTP_200_OK)

class GetSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        subscription = (
            request.user.subscription
            .filter(
                models.Q(end_date__isnull=True) | models.Q(end_date__gt=timezone.now())
            )
            .order_by('-start_date')
            .first()
        )

        if subscription:
            serializer = SubscriptionSerializer(subscription)
            data = {
                'subscription': serializer.data,
                'is_active': subscription.cancelled_at is None,
                'end_date': subscription.end_date.isoformat() if subscription.end_date else None
            }
        else:
            data = {'subscription': None}

        return Response(data, status=status.HTTP_200_OK)

class CancelSubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stripe.api_key = settings.STRIPE_SECRET_KEY_TEST
        subscription_id = request.data.get('subscription_id')
        subscription = get_object_or_404(Subscription, user=request.user, subscription_id=subscription_id)

        stripe.Subscription.modify(
            subscription_id,
            cancel_at_period_end=True
        )

        subscription.cancelled_at = now()
        stripe_subscription = stripe.Subscription.retrieve(subscription_id)
        subscription.end_date = timezone.make_aware(
            datetime.fromtimestamp(stripe_subscription['current_period_end'])
        )
        subscription.save()

        return Response({'message': 'Subscription cancelled successfully', 'end_date': subscription.end_date.isoformat()}, status=status.HTTP_200_OK)
