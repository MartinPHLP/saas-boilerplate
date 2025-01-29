from .views import *
from django.urls import path


urlpatterns = [
    path('create-checkout-session/', CreateCheckoutSessionView.as_view(), name='create-checkout-session'),
    path('create-subscription/', CreateSubscriptionView.as_view(), name='create-subscription'),
    path('get-subscription/', GetSubscriptionView.as_view(), name='get-subscription'),
    path('cancel-subscription/', CancelSubscriptionView.as_view(), name='cancel-subscription'),
]
