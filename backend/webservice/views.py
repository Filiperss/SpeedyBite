from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import boto3

@require_http_methods(["GET"])
# Fetch every record of "MenuItems" table from AWS DynamoDB
def menuList(request):
    # Better pratice is to create a folder named .aws, in home directory, and inside that, 2 files called credentials and config:
    # cd ~ | mkdir .aws | echo .aws/config | echo .aws/credentials

    # Inside .aws/credentials type the aws_access_key_id=.., aws_secret_access_key=.., aws_session_token=..
    # Inside .aws/config type the region_name=...

    dynamodb = boto3.resource('dynamodb', 
        aws_access_key_id = "ASIA2Q44LFHGNOBGB3TS", 
        aws_secret_access_key = "60IrN3y5Gv96BSH+MmhmTTMFpmC3BAMUlnBYTdup",
        aws_session_token= "FwoGZXIvYXdzEMj//////////wEaDDjtpT2YLUeXGqn5DiLLAdeQ08OH82zR/mVxMfVER93qYHTOwX9Ge4UX9UoTOs0OjharR0SMqCDp8yTuSooXVH+hbPdsuepxCkGYW9ER0XyaTUWGPMnfwRNkU39nICCQBaqA/C3AO8DTbrfZblwkv4xz/fRNN59PRYwO+EGGcFkCefiR/1MKYhYcgq9tvfTxsRgGW1alFFN0AMo0BoRUQhqdlaamYulVHhevdbIpvDhzlmKNFAelJIZEKhb6wkSBvaXG6tfKpcGIN867uVH2zCaYLP4g5OrD0ifVKNeRhJQGMi2UIbFljJPhXTF1ms9C14lU1r25ptvcI43wHa7D9qIv+GcZia4TWOdyq7FGtqA=", 
        region_name='us-east-1')
    
    # Gets data from database "MenuItems" 
    table = dynamodb.Table('MenuItems')

    # Scans every record from table "MenuItems"
    response = table.scan()
    
    # Returns every record in table "MenuItems"
    return JsonResponse({ 'menuItems' : response["Items"]})

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