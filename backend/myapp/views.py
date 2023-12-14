from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from .models import FurnitureDefect
from .serializers import FurnitureDefectSerializer

class RegisterUserView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')
        
        if not username or not password or not email:
            return Response({'message': 'Please provide all required fields'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'message': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    
        if User.objects.filter(email=email).exists():
            return Response({'message': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, email=email, password=password)
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class UserLoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username or not password:
            return Response({'message': 'Please provide both username and password'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user:
            token, created = Token.objects.get_or_create(user=user)
            return Response({'message': 'Login successful', 'access_token': token.key, 'is_admin': user.is_superuser})
        else:
            return Response({'message': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

class FurnitureDefectsView(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAdminUser]

    def get(self, request):
        all_objects = FurnitureDefect.objects.all()
        serializer = FurnitureDefectSerializer(all_objects, many=True)
        return Response(serializer.data)

class RegisterDefectView(APIView):
    authentication_classes = [TokenAuthentication]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request):
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
                    return Response(serializer.data, status=status.HTTP_201_CREATED) 
                else:
                    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
            else:
                return Response({'error': 'Invalid authorization header'}, status=status.HTTP_401_UNAUTHORIZED)
        except Token.DoesNotExist:
            return Response({'error': 'Invalid access token'}, status=status.HTTP_401_UNAUTHORIZED)

class UpdateDefectView(APIView):
    authentication_classes = [TokenAuthentication]

    def put(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Token '):
                token_key = auth_header.split(' ')[1]
                access_token = Token.objects.get(key=token_key)
                user = access_token.user
                defect_id = request.data.get('defect_id')
                if defect_id is None:
                    return Response({'error': 'Defect ID is missing'}, status=status.HTTP_400_BAD_REQUEST)
                
                try:
                    defect = FurnitureDefect.objects.get(defect_id=defect_id)
                    if not user.is_superuser:
                        return Response({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
                except FurnitureDefect.DoesNotExist:
                    return Response({'error': 'Defect does not exist'}, status=status.HTTP_404_NOT_FOUND)
    
                new_is_resolved = request.data.get('is_resolved')
                new_resolution_description = request.data.get('resolution_details')
                if new_is_resolved is not None:
                    defect.is_resolved = new_is_resolved
                if new_resolution_description:
                    defect.resolution_details = new_resolution_description
                defect.save()
    
                return Response({'message': 'Defect updated successfully'}, status=status.HTTP_200_OK)
        except Token.DoesNotExist:
            return Response({'error': 'Invalid access token'}, status=status.HTTP_401_UNAUTHORIZED)

class FurnitureDefectsUserView(APIView):
    def get(self, request):
        try:
            auth_header = request.headers.get('Authorization')
            if auth_header and auth_header.startswith('Token '):
                token_key = auth_header.split(' ')[1]
                access_token = Token.objects.get(key=token_key)
                user = access_token.user
                
                user_defects = FurnitureDefect.objects.filter(user=user)
                
                serializer = FurnitureDefectSerializer(user_defects, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid authorization header'}, status=status.HTTP_401_UNAUTHORIZED)
        except Token.DoesNotExist:
            return Response({'error': 'Invalid access token'}, status=status.HTTP_401_UNAUTHORIZED)
