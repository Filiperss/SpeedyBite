from django.urls import path, re_path
from . import views
# from .views import LoginStaffView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from rest_framework import permissions
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi

from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

# schema_view = get_schema_view(
#     openapi.Info(
#         title="Snippets API",
#         default_version='v1',
#         description="Test description",
#         terms_of_service="https://www.google.com/policies/terms/",
#         contact=openapi.Contact(email="contact@snippets.local"),
#         license=openapi.License(name="BSD License"),
#     ),
#     public=True,
#     permission_classes=[permissions.AllowAny],
# )


urlpatterns = [
    # Staff Endpoints

    #Endpoint to obtain JWT Token
    path('token', TokenObtainPairView.as_view()),

    #Endpoint to obtain JWT Token
    path('token/refresh', TokenRefreshView.as_view()),

    # Endpoint for the kitchen staff register
    path('register', views.RegisterStaff.as_view()),

    # Endpoint for the kitchen staff login - DEPRECATED, use /token instead
    path('login', views.loginStaff),

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

    #Swagger     

    path('schema', SpectacularAPIView.as_view(), name='schema'),
    re_path(r'^$',SpectacularSwaggerView.as_view()),
    #Docs
    re_path(r'^redoc', SpectacularRedocView.as_view()),
]
