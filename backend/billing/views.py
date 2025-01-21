import json
import stripe

from .models import UserPayment
from rest_framework import status
from django.http import HttpResponse
from authentication.models import User
from core.settings import FRONTEND_URL
from rest_framework.views import APIView
from rest_framework.response import Response
from core.settings import STRIPE_SECRET_KEY_TEST
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated


class CreateCheckoutSessionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        stripe.api_key = STRIPE_SECRET_KEY_TEST
        user = request.user
        plan_id = request.data.get('plan_id')

        if not plan_id or plan_id not in [2, 3]:
            return Response(
                {'error': 'Invalid plan id'},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            if not hasattr(user, 'userpayment') or not user.userpayment.stripe_customer_id:
                customer = stripe.Customer.create(
                    email=user.email,
                    metadata={'user_id': str(user.id)}
                )
                customer_id = customer.id

            else:
                customer_id = user.userpayment.stripe_customer_id

            price_id = {
                2: 'price_1Qixod03CwllEL7eVoEkaKfK',
                3: 'price_1Qixod03CwllEL7eVoEkaKfK'
            }[plan_id]

            checkout_session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=['card'],
                line_items=[{
                    'price': price_id,
                    'quantity': 1,
                }],
                mode='subscription',
                success_url=f'{FRONTEND_URL}/success?session_id={{CHECKOUT_SESSION_ID}}',
                cancel_url=f'{FRONTEND_URL}/cancel?session_id={{CHECKOUT_SESSION_ID}}',
                metadata={
                    'user_id': str(user.id),
                    'customer_id': customer_id,
                    'plan': str(plan_id)
                }
            )

            price_data = stripe.Price.retrieve(price_id)
            product_data = stripe.Product.retrieve(price_data.product)

            payment = UserPayment.objects.create(
                user=user,
                stripe_customer_id=customer_id,
                stripe_checkout_id=checkout_session.id,
                stripe_product_id=price_id,
                product_name=product_data.name,
                price=price_data.unit_amount / 100,
                currency=price_data.currency
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

class UserPaymentsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            payments = UserPayment.objects.filter(user=request.user).order_by('-created_at')
            payments_data = [{
                'id': payment.id,
                'product_name': payment.product_name,
                'price': float(payment.price),
                'currency': payment.currency,
                'has_paid': payment.has_paid,
                'stripe_checkout_id': payment.stripe_checkout_id,
                'created_at': payment.created_at.strftime("%Y-%m-%d")
            } for payment in payments]

            return Response(payments_data)

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

class CancelPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            session_id = request.data.get('session_id')
            if not session_id:
                return Response(
                    {'error': 'Session ID is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            payment = UserPayment.objects.filter(
                stripe_checkout_id=session_id,
                user=request.user
            ).first()

            if payment:
                payment.delete()
                return Response({'message': 'Payment cancelled successfully'})

            return Response(
                {'error': 'Payment not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
