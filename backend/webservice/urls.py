from django.urls import path
from . import views
from .views import LoginView

urlpatterns = [
    # Endpoint for the client's payment
    path('pay', views.pay, name='pay'), 

    # Endpoint for the kitchen staff login
    path('login', LoginView.as_view()),

    # Endpoint for the client's delivery confirmation
    path('confirmDelivery', views.confirmDelivery, name='confirmDelivery'),
    
    # Endpoint for the restaurant's menu
    path('menuList', views.menuList, name='menuList'),

    # Endpoint to calculate client's menu price
    path('calculateClientMenuPrice', views.calculateClientMenuPrice, name='calculateClientMenuPrice'),
]
