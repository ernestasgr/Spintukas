from rest_framework import serializers
from .models import FurnitureDefect
from django.contrib.auth.models import User

class FurnitureDefectSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    class Meta:
        model = FurnitureDefect
        fields = ['defect_id', 'user', 'description', 'created_at', 'location', 'severity', 'is_resolved', 'resolution_details', 'image', 'username']
        read_only_fields = ['defect_id', 'created_at', 'username']

    def create(self, validated_data):
        return FurnitureDefect.objects.create(**validated_data)
    
    def get_username(self, obj):
        return obj.user.username if obj.user else None
