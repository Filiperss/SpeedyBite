import json
from sre_constants import SUCCESS
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
import boto3
import base64
import uuid

from boto3.dynamodb.conditions import Key

from rest_framework.views import APIView
from drf_spectacular.utils import OpenApiParameter, extend_schema, extend_schema_field, OpenApiTypes

from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import IsAuthenticated

from .models import User
from .serializers import UserSerializer
from django.contrib.auth.hashers import make_password, check_password


#AWS
AWS_ACCESS_KEY_ID = 'ASIAVREJBYCM66GHAQN6'
AWS_SECRET = 'bwUpo7jOnP1Ka7jafu2nj0PrNBMxrAjfoLqWmsiz'
AWS_SESSION_TOKEN = 'FwoGZXIvYXdzEE8aDPj2LzUUrptM6EVtTSLLARStK6jy1DTxzubGhl/6jF2Ihw9D9z6oJFsVehORRRuNynGNwibsIzc1VKTGltjdDL7xDQkxvEh1NXqYhNc6BJ8R01yiuU8KGo8KHYWccucsl1ojCB7Ut2Fph0OrctWuznHY6CU/wL7qkkQbI8phYFbDhNj7ultNCiBrVWStnHQ/QXQ861QCaHWvB4BPbndVM7lLWAUtN+HrkvdTHlrk0Hzf1qSIlnPiA2n0bq62t3JqdG6NnMqa7vJVNLG7NoBAMRGkcSZqpk/vIkqzKMaa2pQGMi0muQzkHamYX18SfcYEjlK4iVJtZLVGoGrzrfVaXUC9qwRGU977STWXzKTgiBg='


# Fetch every record of "MenuItems" table from AWS DynamoDB
@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def menuList(request):

	dynamodb = boto3.resource('dynamodb', aws_access_key_id=AWS_ACCESS_KEY_ID,
				aws_secret_access_key=AWS_SECRET,
				aws_session_token=AWS_SESSION_TOKEN,
				region_name="us-east-1")
	
	# # Gets data from database "MenuItems" 
	table = dynamodb.Table('MenuItems')

	# # Scans every record from table "MenuItems"
	response = table.scan()
	
	# # Returns every record in table "MenuItems"
	return JsonResponse({ 'menuItems' : response["Items"]})

# Payment
# @csrf_exempt
@api_view(["POST"])
@authentication_classes([])
@permission_classes([])
def pay(request):
	print(request)
	# Deserializes request to JSON
	response_decoded = json.loads(request.body.decode("utf-8"))
	# Retrieves the first occurrence/index of "base64"
	index = response_decoded["clientPhoto"].find("base64")

	# Cuts off the initial header | "e.g: data:jpg\base64,"
	headlessPhoto = response_decoded["clientPhoto"][index + 7:]
   
	s3 = boto3.resource('s3')  
	
	# filePath = 'tmp/'+response_decoded["fileName"] 
	filePath = 'tmp/'+str(uuid.uuid4()) 
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


	# If face is recognized, it executes "create-order" Step-Function
	if(response["status"] != "FAILED" or json.loads(response["output"])["statusCode"] != 200):

		outputRekognition = json.loads(response["output"])
		response_decoded["fileName"] = ""
		response_decoded["clientName"] = outputRekognition["body"]["message"]

		# Starts execution of "Create-order" Step-Function
		response = client.start_execution(stateMachineArn='arn:aws:states:us-east-1:380392030361:stateMachine:ActivityCreator',
						input = json.dumps(response_decoded))
		print(response)
		if(response["ResponseMetadata"]["HTTPStatusCode"] == 200):
			return Response({"message": "Payment successfully done.\nWe are cooking your meal."})
		else:
			return Response({"message": "Something went wrong while processing the payment. Please try again."}, status= status.HTTP_500_INTERNAL_SERVER_ERROR)    
	else:
		return Response({"message": "Face not recognized, please try again."}, status= status.HTTP_404_NOT_FOUND)



# #@csrf_exempt
# #@authentication_classes([])
# #@permission_classes([])
# #@api_view(["POST"])
# # Calculates client's menu total price
# def calculateClientMenuPrice(request):
#     menuTotalPrice = 0
#     request_decoded = json.loads(request.body.decode("utf-8"))

#     for i in request_decoded:
#         menuTotalPrice = menuTotalPrice + float(i['ItemPrice'])

#     return JsonResponse(menuTotalPrice)

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
	response_decoded = json.loads(request.body.decode("utf-8"))

	username = response_decoded["username"]
	encrypted_password = make_password(response_decoded['password'], 'ES2022')

	dynamodb = boto3.resource('dynamodb')

	# Gets data from table "Users" 
	table = dynamodb.Table('Staff')

	# Fetches record from "Staff" of given username (passed by input)
	response = table.query(KeyConditionExpression=Key('username').eq(username))
	
	# Get items returned by table.query()
	# It could return more than one, how it is done currently, but for now it works
	item = response["Items"]

	#if there are no items returned (Count == 0) or if passwords don't match
	# NOTE: Doesnt work because admin creates user manually, so check_password does not work
	if response["Count"] == 0 or encrypted_password != item[0]["password"]:
		raise AuthenticationFailed('Wrong Credentials.')

	return Response({'message': 'Login Successful. Welcome!'})

#Pick an order that is currently available
@api_view(['GET'])
def pickOrder(request):
	
	# dynamodb = boto3.resource('dynamodb', aws_access_key_id='ASIAVREJBYCMSWSU4WUL',
    #                        aws_secret_access_key='XVWbw3tDSf4TxAsR6BydLpE357eNdTF/bQyX8uUt',
    #                        aws_session_token='FwoGZXIvYXdzEE4aDLxfaCJoaa/wctcJfCLLAe4YLnyb9c9ajcxx+I5PQLd/MC8ecLSyM0EDsNnOokNyM9Owib/IABURkaeeLxnGWZBgkxHBmJ76OOpxjmTaxsbuW073VLIJroIIvm0dkwHfnMZ3CCGPUsi6JEvA8/DzNT+Q2Lz9RHjy96tNSLiY2ZSCcGAToXjOPhGLJE49U0LHrFYp3Qj7JBhTbIlNxcnWsu5yF0SZV6IZmR/27zd/EIuM/6oWS/YW6hvZLBcNSSuEW3nz4IGqJ3cjI7HSjlM+NAp9Dq2vJLtr2gUkKJbt2ZQGMi25kPeAuboU9TD+/hpQ/Ot/CpJg8GTri4gs4XwGItdrFDgEBrFp6EPDEmhlQek=',
    #                        region_name="us-east-1")


	client = boto3.client('stepfunctions', aws_access_key_id=AWS_ACCESS_KEY_ID,
				aws_secret_access_key=AWS_SECRET,
				aws_session_token=AWS_SESSION_TOKEN,
				region_name="us-east-1")

	response = client.start_sync_execution(stateMachineArn='arn:aws:states:us-east-1:380392030361:stateMachine:GetOrder')

	if response["output"] is None:
		return Response({"message": "An Error happened while catching an order."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
	
	responseOutput = response["output"]
	order = json.loads(orderInfo)
	# print("Inputted\n\n\n",order)
	inputted = json.loads(order["Input"])
	# print(inputted["menuItems"])
	# Returns an active Order
	return Response(inputted)

