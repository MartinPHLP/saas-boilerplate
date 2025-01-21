from rest_framework import status
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import UserSerializer, RegisterSerializer
from .jwt_claims import CustomTokenObtainPairSerializer
from .permissions import RequiredPlanPermission
from django.contrib.auth.tokens import default_token_generator
from django.conf import settings
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth import get_user_model
from core.settings import FRONTEND_URL
from email.message import EmailMessage
import certifi
import smtplib
import ssl
import os
import logging


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
            user.is_active = False  # Désactiver le compte jusqu'à la vérification
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
            user.delete()
            logger.info(f"User deleted successfully: {user.username}")
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

class VerifyEmailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, uid, token):
        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)

            if default_token_generator.check_token(user, token):
                user.is_active = True
                user.is_email_verified = True
                user.save()

                # Générer le token de connexion
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


# class TestPlanView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         plan = request.user.plan
#         message = {
#             1: "You have access to the free plan",
#             2: "You have access to the premium plan",
#             3: "You have access to the pro plan"
#         }
#         return Response({
#             'message': message[plan],
#             'plan': plan
#         })

# class TestPremiumView(APIView):
#     permission_classes = [IsAuthenticated, RequiredPlanPermission]
#     required_plan = 2

#     def get(self, request):
#         return Response({
#             'message': 'You have access to the premium features !',
#             'plan': request.user.plan
#         })

# class TestProView(APIView):
#     permission_classes = [IsAuthenticated, RequiredPlanPermission]
#     required_plan = 3

#     def get(self, request):
#         return Response({
#             'message': 'You have access to the pro features !',
#             'plan': request.user.plan
#         })
