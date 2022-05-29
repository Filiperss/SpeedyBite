import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import boto3
import base64

from rest_framework.views import APIView
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_field, OpenApiTypes

from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password, check_password


# Fetch every record of "MenuItems" table from AWS DynamoDB
@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
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
    return Response({ 'menuItems' : response["Items"]})
    # return JsonResponse({'message': 'Temporary Maintenance'})

# Payment
# @csrf_exempt
@authentication_classes([])
@permission_classes([])
@api_view(["POST"])
def pay(request):
    # Deserializes request to JSON
    response_decoded = json.loads(request.body.decode("utf-8"))

    # Retrieves the first occurrence/index of "base64"
    index = response_decoded["clientPhoto"].find("base64")

    # Cuts off the initial header | "e.g: data:jpg\base64,"
    headlessPhoto = response_decoded["clientPhoto"][index + 7:]
   
    s3 = boto3.resource('s3')  
    
    filePath = 'tmp/'+response_decoded["fileName"]
    obj = s3.Object('imageawsbucket', filePath)
    
    # Posts an object into AWS S3  
    obj.put(Body=base64.b64decode(headlessPhoto))

    # Initiates the boto3 client for AWS stepfunctions
    client = boto3.client('stepfunctions')
    
    # Overwrites the old filePath to the new one, for the Rekognition to "recognize"
    response_decoded["fileName"] = filePath
    response_decoded["clientPhoto"] = ""
    
    response = client.start_execution(stateMachineArn='arn:aws:states:us-east-1:380392030361:stateMachine:SearchFaceInCollection',
    input = json.dumps(response_decoded))
    
    # Get execution's status
    response = client.describe_execution(
        executionArn=response["executionArn"]
    )
    print(response)
    
    return HttpResponse("Payment sucessfull")


@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
# Client's Face recognition
def confirmDelivery(request):
    return HttpResponse(NotImplemented);

# @csrf_exempt
@authentication_classes([])
@permission_classes([])
@api_view(["POST"])
# Calculates client's menu total price
def calculateClientMenuPrice(request):
    menuTotalPrice = 0
    request_decoded = json.loads(request.body.decode("utf-8"))

    for i in request_decoded:
        menuTotalPrice = menuTotalPrice + float(i['ItemPrice'])

    return HttpResponse(menuTotalPrice)

# Staff Registration
# @api_view(['POST'])
# @authentication_classes([])
# @permission_classes([])
# def registerStaff(request):
#     authentication_classes = []
#     permission_classes = []
#     serializer = UserSerializer(data=request.data)
#     serializer.is_valid(raise_exception=True)
#     serializer.save()
#     return Response(serializer.data)
@authentication_classes([])
@permission_classes([])
class RegisterStaff(APIView):
    @extend_schema(request=None, responses=UserSerializer)
    def post(self, request, *args, **kwargs):
        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

#Staff Login - DEPRECATED
@api_view(['POST'])
@authentication_classes([])
@permission_classes([])
def loginStaff(request):
    username = request.data.get('username')
    encrypted_password = make_password(request.data['password'], 'ES2022')

    user = User.objects.filter(username=username).first()

    print(user.password)
    print(encrypted_password)

    #if user is None or not user.check_password(password):
    # NOTE: Doesnt work because admin creates user manually, so check_password does not work
    if user is None or encrypted_password != user.password:
        raise AuthenticationFailed('Wrong Credentials.')

    return Response({'message': 'Login Successful. Welcome!'})

#Get all Orders available
@api_view(['GET'])
def checkOrders(request):
    # permission_classes = (IsAuthenticated, )
    return Response({'message': 'TODO'})

#Pick an order that is currently available
@api_view(['GET'])
def pickOrder(request):
    # permission_classes = (IsAuthenticated, )
    return Response({'message': 'TODO'})
