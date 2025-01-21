from django.urls import path
# from .views import TestPlanView, TestPremiumView, TestProView
from .views import RegisterView, LoginView, DeleteAccountView, RequestPasswordResetView, ResetPasswordView, VerifyEmailView


urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    # path('test-plan/', TestPlanView.as_view(), name='test-plan'),
    # path('test-premium/', TestPremiumView.as_view(), name='test-premium'),
    # path('test-pro/', TestProView.as_view(), name='test-pro'),
    path('reset-password-request/', RequestPasswordResetView.as_view(), name='reset-password-request'),
    path('reset-password/<str:uid>/<str:token>/', ResetPasswordView.as_view(), name='reset-password'),
    path('verify-email/<str:uid>/<str:token>/', VerifyEmailView.as_view(), name='verify-email'),
]
