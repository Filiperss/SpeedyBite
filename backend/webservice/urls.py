from django.urls import path
from . import views
# from .views import LoginStaffView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
    # Staff Endpoints

    #Endpoint to obtain JWT Token
    path('token', TokenObtainPairView.as_view()),

    #Endpoint to obtain JWT Token
    path('token/refresh', TokenRefreshView.as_view()),

    # Endpoint for the kitchen staff register
    path('register', views.registerStaff),

    # Endpoint for the kitchen staff login - DEPRECATED, use /token instead
    #path('login', views.loginStaff),

    path('checkOrders', views.checkOrders),#views.CheckOrdersView.as_view()),

    # Clients Endpoints

    # Endpoint for the client's payment
    path('pay', views.pay, name='pay'),

    # Endpoint for the client's delivery confirmation
    path('confirmDelivery', views.confirmDelivery, name='confirmDelivery'),
    
    # Endpoint for the restaurant's menu
    path('menuList', views.menuList, name='menuList'),

    # Endpoint to calculate client's menu price
    path('calculateClientMenuPrice', views.calculateClientMenuPrice, name='calculateClientMenuPrice'),
]
