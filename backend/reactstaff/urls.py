from django.urls import path
from . import views

from django.views.generic import TemplateView

urlpatterns = [
    path('', (TemplateView.as_view(
        template_name="../../staff-frontend/build/index.html",
    )), name='index.html'),
]
