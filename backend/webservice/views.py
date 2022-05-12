from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt

@require_http_methods(["GET"])
# Menu Items
def menuList(request):
    menuItems = ['Sopa de Feijão', 'Caldo Verde', 'Lombo Assado']
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