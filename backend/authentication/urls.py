from .views import *
from django.urls import path


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('reset-password-request/', RequestPasswordResetView.as_view(), name='reset-password-request'),
    path('reset-password/<str:uid>/<str:token>/', ResetPasswordView.as_view(), name='reset-password'),
    path('verify-email/<str:uid>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('test-plan/', TestPlanView.as_view(), name='test-plan'),
]
