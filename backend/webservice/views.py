import json
from sre_constants import SUCCESS
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
    dynamodb = boto3.resource('dynamodb')
    
    # # Gets data from database "MenuItems" 
    table = dynamodb.Table('MenuItems')

    # # Scans every record from table "MenuItems"
    response = table.scan()
    
    # # Returns every record in table "MenuItems"
    return JsonResponse({ 'menuItems' : response["Items"]})

# Payment
@csrf_exempt
#@authentication_classes([])
#@permission_classes([])
#@api_view(["POST"])
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

    # Starts execution of AWS Rekognition Step-Function 
    response = client.start_sync_execution(stateMachineArn='arn:aws:states:us-east-1:380392030361:stateMachine:SearchFace',
    input = json.dumps(response_decoded))

    outputRekognition = json.loads(response["output"])
    response_decoded["fileName"] = ""
    response_decoded["clientName"] = outputRekognition["body"]["message"]
    
    # If face is recognized, it executes "create-order" Step-Function
    if(outputRekognition["statusCode"] == 200):

        # Starts execution of "Create-order" Step-Function
        response = client.start_execution(stateMachineArn='arn:aws:states:us-east-1:380392030361:stateMachine:ActivityCreator',
        input = json.dumps(response_decoded))

        if(response["HTTPStatusCode"] == 200):
            return HttpResponse("\nPayment successfully done.\nWe are cooking your meal.\n")
        else:
            return HttpResponse("\nSomething went wrong while processing the payment.\nPlease try again.\n")    
    else:
        return HttpResponse("\nFace not recognized, please try again.\n")

@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
# Client's Face recognition
def confirmDelivery(request):
    return HttpResponse(NotImplemented);

#@csrf_exempt
#@authentication_classes([])
#@permission_classes([])
#@api_view(["POST"])
# Calculates client's menu total price
def calculateClientMenuPrice(request):
    menuTotalPrice = 0
    request_decoded = json.loads(request.body.decode("utf-8"))

    for i in request_decoded:
        menuTotalPrice = menuTotalPrice + float(i['ItemPrice'])

    return JsonResponse(menuTotalPrice)

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
    # @extend_schema(
    #     parameters=[
    #         OpenApiParameter(name='name', description='Name of the Staff', required=False, type=str),
    #         OpenApiParameter(name='username', description='Username of the Staff', required=True, type=str),
    #         OpenApiParameter(name='password', required=True, type=str),
    #     ])
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
