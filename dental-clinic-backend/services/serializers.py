from rest_framework import serializers
from .models import ServiceCategory, Service, AppointmentService

class ServiceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'description']

class ServiceSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'category', 'category_name', 'name', 'description',
            'price', 'duration', 'image_url', 'is_active'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
        return None

class AppointmentServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.CharField(source='service.name', read_only=True)
    total_price = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    
    class Meta:
        model = AppointmentService
        fields = ['id', 'appointment', 'service', 'service_name', 'quantity', 'price', 'notes', 'total_price']
        
    def create(self, validated_data):
        # Set the price from the service if not provided
        if 'price' not in validated_data:
            validated_data['price'] = validated_data['service'].price
        return super().create(validated_data) 