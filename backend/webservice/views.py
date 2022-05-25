import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import boto3
import base64


@require_http_methods(["GET"])
# Fetch every record of "MenuItems" table from AWS DynamoDB
def menuList(request):
    # Better pratice is to create a folder named .aws, in home directory, and inside that, 2 files called credentials and config:
    # cd ~ | mkdir .aws | echo .aws/config | echo .aws/credentials

    # Inside .aws/credentials type the aws_access_key_id=.., aws_secret_access_key=.., aws_session_token=..
    # Inside .aws/config type the region_name=...

    dynamodb = boto3.resource('dynamodb', 
        aws_access_key_id = "ASIA2Q44LFHGKZRNICWV",
        aws_secret_access_key = "39DJXpStU6578yCsgkyLUgb0oXCak4kFBgHmLpLn",
        aws_session_token = "FwoGZXIvYXdzEBQaDIWEVd8ftV+JSwaNXCLLAeXbVaWC8mhccGkkXuYp5ZL6AuHH4NliMQ2A94mmyDlkaeUJe1e4kmUNI5AwfIT+1hUE0p/8O4UTZKWuR+Hcug+lYPDY/UAEkzZrEk3o5ybDKZZH6xSjScMWBOnYjvmkSsxf8sf0MJdfEq0+hK0DK1kBSZfD4Z3/S/yEXIKj/qMlqTiA1++cho3K089y+vEIx4F9UH7otnsY3QNWoKg6r6bQ1SsXyaLSY3SS9lnaE295qdFawYcajpQIxxyOe/g5SwBcecSXYC/ugBmGKPmClZQGMi2j3btzqt62NJPNGnRsSuFvnO82c9pks1GezXsxlO0jpaDgapOPp7Dw+nELSs8=",
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
    # Deserializes request to JSON
    response_decoded = json.loads(request.body.decode("utf-8"))
    print(response_decoded["fileName"])

    # Retrieves the first occurrence/index of "base64"
    index = response_decoded["clientPhoto"].find("base64")

    # Cuts off the initial header | "e.g: data:jpg\base64,"
    headlessPhoto = response_decoded["clientPhoto"][index + 7:]
   
    s3 = boto3.resource('s3')  
    
    obj = s3.Object('imageawsbucket', 'tmp/imagem.jpg')
    
    # Posts an object into AWS S3  
    obj.put(Body=base64.b64decode(headlessPhoto))

    # Initiates the boto3 client for AWS stepfunctions
    # client = boto3.client('stepfunctions')
    # s3 = boto3.resource('s3')
    # s3.meta.client.put_object(Body=response_decoded["clientPhoto"], Bucket='imageawsbucket', Key='file.jpg')

    # response = client.start_execution(stateMachineArn='arn:aws:states:us-east-1:380392030361:stateMachine:SearchFaceInCollection',
    # input=json.dumps(response_decoded))
    
    # Get execution's status
    # response = client.describe_execution(
    #    executionArn=response["executionArn"]
    #)
    # print(response)
    
    return HttpResponse("Payment sucessfull")

@require_http_methods(["POST"])
# Kitchen staff Login
def login(request):
    return HttpResponse(NotImplemented);

@require_http_methods(["POST"])
# Client's Face recognition
def confirmDelivery(request):
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
