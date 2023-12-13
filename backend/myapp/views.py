from django.contrib.auth.models import User
from django.http import JsonResponse
from django.contrib.auth import authenticate
from .models import FurnitureDefect
from .serializers import FurnitureDefectSerializer
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, authentication_classes, permission_classes, parser_classes
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework import status

@api_view(['POST'])
def register(request):
    username = request.data['username']
    email = request.data['email']
    password = request.data['password']
    
    if not username or not password or not email:
        return JsonResponse({'message': 'Please provide all required fields'}, status=400)
    
    if User.objects.filter(username=username).exists():
        return JsonResponse({'message': 'Username already exists'}, status=400)

    if User.objects.filter(email=email).exists():
        return JsonResponse({'message': 'Email already exists'}, status=400)
    
    user = User.objects.create_user(username=username, email=email, password=password)
    return JsonResponse({'message': 'User created successfully'}, status=201)

@api_view(['POST'])
def user_login(request):
    username = request.data['username']
    password = request.data['password']
    
    if not username or not password:
        return JsonResponse({'message': 'Please provide both username and password'}, status=400)
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, created = Token.objects.get_or_create(user=user)
        
        return JsonResponse({'message': 'Login successful', 'access_token': token.key, 'is_admin': user.is_superuser})
    else:
        return JsonResponse({'message': 'Invalid credentials'}, status=401)

@api_view(['GET'])
@authentication_classes([TokenAuthentication]) 
@permission_classes([IsAdminUser])
def furniture_defects(request):
    all_objects = FurnitureDefect.objects.all()
    data = []
    for obj in list(all_objects.values()):
        obj_data = {
            'defect_id': obj['defect_id'],
            'description': obj['description'],
            'created_at': obj['created_at'],
            'location': obj['location'],
            'severity': obj['severity'],
            'is_resolved': obj['is_resolved'],
            'resolution_details': obj['resolution_details'],
            'image': obj['image'],
            'username': User.objects.get(id=obj['user_id']).username
        }
        data.append(obj_data)
    return JsonResponse(data, safe=False)

@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@parser_classes([MultiPartParser, FormParser])
def register_defect(request):
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            access_token = Token.objects.get(key=token_key)
            user = access_token.user
            request.data['user'] = user.id
            serializer = FurnitureDefectSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save(user=user) 
                return Response(serializer.data, status=201) 
            else:
                return Response(serializer.errors, status=400) 
        else:
            return JsonResponse({'error': 'Invalid authorization header'}, status=401)
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Invalid access token'}, status=401)
    
@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
def update_defect(request):
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            access_token = Token.objects.get(key=token_key)
            user = access_token.user
            defect_id = request.data.get('defect_id')
            if defect_id is None:
                return JsonResponse({'error': 'Defect ID is missing'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                defect = FurnitureDefect.objects.get(defect_id=defect_id)
                if not user.is_superuser:
                    return JsonResponse({'error': 'Unauthorized'}, status=401)
            except FurnitureDefect.DoesNotExist:
                return JsonResponse({'error': 'Defect does not exist'}, status=status.HTTP_404_NOT_FOUND)

            new_is_resolved = request.data.get('is_resolved')
            new_resolution_description = request.data.get('resolution_details')
            if new_is_resolved is not None:
                defect.is_resolved = new_is_resolved
            if new_resolution_description:
                defect.resolution_details = new_resolution_description
            defect.save()

            return JsonResponse({'message': 'Defect updated successfully'}, status=200)
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Invalid access token'}, status=401)

@api_view(['GET'])
def furniture_defects_user(request):
    try:
        auth_header = request.headers.get('Authorization')
        if auth_header and auth_header.startswith('Token '):
            token_key = auth_header.split(' ')[1]
            access_token = Token.objects.get(key=token_key)
            user = access_token.user
            
            user_defects = FurnitureDefect.objects.filter(user=user)
            
            data = list(user_defects.values())
            return JsonResponse(data, safe=False)
        else:
            return JsonResponse({'error': 'Invalid authorization header'}, status=401)
    except Token.DoesNotExist:
        return JsonResponse({'error': 'Invalid access token'}, status=401)