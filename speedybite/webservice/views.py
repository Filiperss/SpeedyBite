from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from webservice.models import MenuItem

@require_http_methods(["GET"])
# Menu Items
def menuList(request):
    menuItems = list(MenuItem.objects.values())
    print("Menu items from database: ", menuItems)    
    return JsonResponse({ 'menuItems' : menuItems});

@csrf_exempt
@require_http_methods(["POST"])
# Payment
def pay(request):
    return HttpResponse("Payment sucessfull");

@require_http_methods(["POST"])
# Kitchen staff Login
def login(request):
    return HttpResponse(NotImplemented);

@require_http_methods(["POST"])
# Client's Face recognition
def faceRecognition(request):
    return HttpResponse(NotImplemented);