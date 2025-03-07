import os
import ssl
import stripe
import smtplib
import logging
import certifi

from django.conf import settings
from rest_framework import status
from core.settings import FRONTEND_URL
from email.message import EmailMessage
from billing.models import Subscription
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .permissions import RequiredPlanPermission
from .jwt_claims import CustomTokenObtainPairSerializer
from django.utils.encoding import force_bytes, force_str
from .serializers import UserSerializer, RegisterSerializer
from django.contrib.auth.tokens import default_token_generator
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode


logger = logging.getLogger(__name__)
User = get_user_model()


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def send_verification_email(self, user, verification_url):
        email_sender = os.getenv("EMAIL_HOST_USER")
        email_password = os.getenv("EMAIL_HOST_PASSWORD")

        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = user.email
        em['Subject'] = 'Verify your email address'

        content = f"""
        <html>
            <body>
                <h2>Email Verification</h2>
                <p>Thank you for registering! Please click on this link to verify your email:</p>
                <p><a href="{verification_url}">{verification_url}</a></p>
            </body>
        </html>
        """
        em.add_alternative(content, subtype='html')
        context = ssl.create_default_context(cafile=certifi.where())

        try:
            with smtplib.SMTP(os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT")) as server:
                server.starttls(context=context)
                server.login(email_sender, email_password)
                server.send_message(em)
                logger.info(f"Verification email sent successfully to {user.email}")
                return True
        except Exception as e:
            logger.error(f"Error sending verification email: {str(e)}")
            return False

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save()
            user.is_active = False
            user.save()

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            verification_url = f"{FRONTEND_URL}/verify-email/{uid}/{token}"

            if self.send_verification_email(user, verification_url):
                logger.info(f"User registered successfully: {user.username}")
                return Response({
                    'message': 'Registration successful. Please check your email to verify your account.'
                }, status=status.HTTP_201_CREATED)

            else:
                return Response({
                    'error': 'Error sending verification email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        logger.error(f"Error registering user: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        if not username or not password:
            return Response({
                'error': 'Please provide username and password'
            }, status=status.HTTP_400_BAD_REQUEST)

        user = authenticate(username=username, password=password)

        if user:
            token = CustomTokenObtainPairSerializer.get_token(user)
            return Response({
                'user': UserSerializer(user).data,
                'token': str(token.access_token)
            })

        return Response({
            'error': 'Invalid credentials'
        }, status=status.HTTP_401_UNAUTHORIZED)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user

        if user.is_authenticated:
            stripe.api_key = settings.STRIPE_SECRET_KEY_TEST

            # Cancel and delete Stripe subscriptions
            subscriptions = Subscription.objects.filter(user=user)
            for subscription in subscriptions:
                try:
                    stripe.Subscription.modify(
                        subscription.subscription_id,
                        cancel_at_period_end=True
                    )
                    subscription.delete()
                except stripe.error.StripeError as e:
                    logger.error(f"Error cancelling Stripe subscription: {str(e)}")

            # Delete user's media folders if they exist
            try:
                if hasattr(user, 'service_data'):
                    import shutil
                    user_media_path = user.service_data.get_user_media_path
                    if os.path.exists(user_media_path):
                        shutil.rmtree(user_media_path)
                        logger.info(f"User media folders deleted successfully: {user_media_path}")
            except Exception as e:
                logger.error(f"Error deleting user media folders: {str(e)}")

            user.delete()
            logger.info(f"User and related data deleted successfully: {user.username}")

            return Response({
                'message': 'Account deleted successfully'
            }, status=status.HTTP_200_OK)

        logger.error(f"TRY TO DELETE USER NOT AUTHENTICATED: {user.username}")
        return Response({
            'error': 'User not authenticated'
        }, status=status.HTTP_401_UNAUTHORIZED)


class RequestPasswordResetView(APIView):
    permission_classes = [AllowAny]

    def send_password_reset_email(self, destination, reset_url):
        email_sender = os.getenv("EMAIL_HOST_USER")
        email_password = os.getenv("EMAIL_HOST_PASSWORD")

        em = EmailMessage()
        em['From'] = email_sender
        em['To'] = destination
        em['Subject'] = 'Password Reset Request'

        content = f"""
        <html>
            <body>
                <h2>Password Reset Request</h2>
                <p>Click on this link to reset your password:</p>
                <p><a href="{reset_url}">{reset_url}</a></p>
            </body>
        </html>
        """
        em.add_alternative(content, subtype='html')
        context = ssl.create_default_context(cafile=certifi.where())

        try:
            with smtplib.SMTP(os.getenv("EMAIL_HOST"), os.getenv("EMAIL_PORT")) as server:
                logger.info(f"Connexion to SMTP server with credentials: {email_sender} and {email_password}")
                server.starttls(context=context)
                logger.info("Attempting to connect with credentials...")
                server.login(email_sender, email_password)
                logger.info("Sending email...")
                server.send_message(em)
                logger.info(f"Email sent successfully to {destination}")
                return True

        except Exception as e:
            logger.error(f"Error sending email: {str(e)}")
            return False

    def post(self, request):
        email = request.data.get('email')
        logger.info(f"Attempting password reset for email: {email}")

        if not email:
            logger.error("Attempt to reset password without providing an email")
            return Response({
                'error': 'Email required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
            logger.info(f"User found with ID: {user.id}")

            if not user.is_email_verified:
                logger.info(f"Attempt to reset password for unverified account: {email}")
                return Response({
                    'message': 'Please verify your email address before resetting your password'
                }, status=status.HTTP_200_OK)

            token = default_token_generator.make_token(user)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            reset_url = f"{FRONTEND_URL}/reset-password/{uid}/{token}"

            if self.send_password_reset_email(email, reset_url):
                return Response({
                    'message': 'Password reset email sent'
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Error sending email'
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except User.DoesNotExist:
            logger.info(f"Attempt to reset password for non-existent email: {email}")
            return Response({
                'message': 'If a user exists with this email, a password reset link has been sent'
            }, status=status.HTTP_200_OK)

class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, uid, token):
        logger.info(f"Attempting password reset with uid: {uid} and token")
        new_password = request.data.get('new_password')

        if not new_password:
            logger.error("Password reset attempt without new password")
            return Response({
                'error': 'New password is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
            logger.info(f"Found user with ID: {user.id}")

            if default_token_generator.check_token(user, token):
                logger.info("Token is valid, proceeding with password reset")
                user.set_password(new_password)
                user.save()
                return Response({
                    'message': 'Password successfully reset'
                }, status=status.HTTP_200_OK)

            else:
                logger.error("Invalid token provided for password reset")
                return Response({
                    'error': 'Invalid token'
                }, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, User.DoesNotExist) as e:
            logger.error(f"Error during password reset: {str(e)}")
            return Response({
                'error': 'Invalid reset link'
            }, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')

        if not current_password or not new_password:
            return Response({
                'error': 'Both current and new passwords are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Vérifier si le mot de passe actuel est correct
        if not user.check_password(current_password):
            return Response({
                'error': 'Current password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Changer le mot de passe
        user.set_password(new_password)
        user.save()

        # Générer un nouveau token pour que l'utilisateur reste connecté
        token = CustomTokenObtainPairSerializer.get_token(user)

        return Response({
            'message': 'Password successfully changed',
            'token': str(token.access_token)
        }, status=status.HTTP_200_OK)

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

            if default_token_generator.check_token(user, token):
                # Activate user and verify email
                user.is_active = True
                user.is_email_verified = True
                user.save()

                token = CustomTokenObtainPairSerializer.get_token(user)

                return Response({
                    'message': 'Email verified successfully',
                    'user': UserSerializer(user).data,
                    'token': str(token.access_token)
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'error': 'Invalid verification link'
                }, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, User.DoesNotExist):
            return Response({
                'error': 'Invalid verification link'
            }, status=status.HTTP_400_BAD_REQUEST)


class TestPlanView(APIView):
    permission_classes = [IsAuthenticated, RequiredPlanPermission]
    required_plan = 1

    def get(self, request):
        return Response({
            'message': 'You have access to this resource',
            'plan': request.user.effective_plan
        }, status=status.HTTP_200_OK)
