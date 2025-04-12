from rest_framework import serializers
from .models import Doctor, DoctorSchedule
from accounts.serializers import UserSerializer

class DoctorScheduleSerializer(serializers.ModelSerializer):
    day_name = serializers.CharField(source='get_day_of_week_display', read_only=True)
    
    class Meta:
        model = DoctorSchedule
        fields = ['id', 'day_of_week', 'day_name', 'start_time', 'end_time', 'is_working_day', 'slot_duration']

class DoctorListSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'specialization', 'experience_years', 'working_hours', 'photo_url'
        ]
    
    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        return None

class DoctorDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    schedules = DoctorScheduleSerializer(many=True, read_only=True)
    photo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = [
            'id', 'user', 'specialization', 'experience_years', 
            'description', 'working_hours', 'photo_url', 'schedules',
            'created_at', 'updated_at'
        ]
        
    def get_photo_url(self, obj):
        if obj.photo:
            return self.context['request'].build_absolute_uri(obj.photo.url)
        return None
        
class DoctorCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = [
            'specialization', 'experience_years', 'description', 
            'working_hours', 'photo'
        ] 