import json
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
        aws_access_key_id = "ASIA2Q44LFHGGXT5V7P6", 
        aws_secret_access_key = "NCdAONe24vKk+b4oFdWSORX5SNFaejU34UiC+LzO",
        aws_session_token= "FwoGZXIvYXdzEOP//////////wEaDNXf5JszvR5qZ9KMLiLLAa0nB4DN5yDhtCJvPGAcMNO4P8KhmUZT4mzZG5d8G2S9/f1ACmpOlAo5lUyeNqRlijdoHww4Yjnv1533SSlUtsjo2b5mdccFWNbGP9vYhYzSZ29POAHrbVP8CRRxyKcjwajo53zhA6Oph2AAru0RxyGVO2fhKgIlbMCdlqSvZGSJa3B7mpjWPnkYAHrwboNbprNJ8AFalI/2iX7e5Hn99FWYwb0KyqYBXi+j3Qge3B+xC/JIEvoHzymVN8EXyLmwrikVKro9DrhPS1GqKIWdipQGMi0JETBB4+wNePfEfmHonbWBQ8KIgrRBmAkKvQaKB35/alS+P2nlftiM4GKV0F8=", 
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

@csrf_exempt
@require_http_methods(["POST"])
# Calculates client's menu total price
def calculateClientMenuPrice(request):
    menuTotalPrice = 0
    request_decoded = json.loads(request.body.decode("utf-8"))

    for i in request_decoded:
        menuTotalPrice = menuTotalPrice + float(i['ItemPrice'])

    return HttpResponse(menuTotalPrice)
