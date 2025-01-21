from .views import *
from django.urls import path


urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('payments/', UserPaymentsView.as_view(), name='user-payments'),
    path('cancel-payment/', CancelPaymentView.as_view(), name='cancel-payment'),
]
