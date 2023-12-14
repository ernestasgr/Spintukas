from rest_framework import serializers
from .models import FurnitureDefect

class FurnitureDefectSerializer(serializers.ModelSerializer):
    class Meta:
        model = FurnitureDefect
        fields = ['defect_id', 'user', 'description', 'created_at', 'location', 'severity', 'is_resolved', 'resolution_details', 'image']
        read_only_fields = ['defect_id', 'created_at']

    def create(self, validated_data):
        return FurnitureDefect.objects.create(**validated_data)
