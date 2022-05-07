import json
from django.http import HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt


@require_http_methods(["GET"])
# Payment
def menuList(request):
    return HttpResponse(json.dumps(['sopa1', 'sopa2', 'sopa3', 'prato_1', 'prato_2', 'prato_3']));

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