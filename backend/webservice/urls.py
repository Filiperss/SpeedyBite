from django.urls import path

from . import views

urlpatterns = [
    # Endpoint for the client's payment
    path('pay', views.pay, name='pay'), 

    # Endpoint for the kitchen staff login
    path('login', views.login, name='login'),

    # Endpoint for the client's facial recognition confirmation, when delivering
    path('faceRecognition', views.faceRecognition, name='faceRecognition'),
    
    # Endpoint for the restaurant's menu
    path('menuList', views.menuList, name='menuList'),

]