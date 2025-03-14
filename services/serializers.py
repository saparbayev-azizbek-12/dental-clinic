from rest_framework import serializers
from .models import Services, Images

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Images
        fields = ['id', 'path', 'comment', 'created_at']

class ServiceSerializer(serializers.ModelSerializer):
    work_image = ImageSerializer(required=False)

    class Meta:
        model = Services
        fields = ['id', 'service_name', 'exp_years', 'exp_months', 'price', 'work_image', 'user_id']

    def create(self, validated_data):
        work_image_data = validated_data.pop('work_image', None)
        if work_image_data:
            image_instance = Images.objects.create(**work_image_data)
            validated_data['work_image_id'] = image_instance
        return Services.objects.create(**validated_data)
