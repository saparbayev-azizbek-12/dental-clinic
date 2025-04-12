from rest_framework import serializers
from .models import Patient
from accounts.serializers import UserSerializer

class PatientListSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    phone_number = serializers.CharField(source='user.phone_number')
    age = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id', 'first_name', 'last_name', 'email', 'phone_number',
            'date_of_birth', 'gender', 'age', 'created_at'
        ]

class PatientDetailSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    age = serializers.IntegerField(read_only=True)
    
    class Meta:
        model = Patient
        fields = [
            'id', 'user', 'address', 'date_of_birth', 'gender',
            'blood_group', 'medical_history', 'allergies',
            'age', 'created_at', 'updated_at'
        ]

class PatientCreateUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Patient
        fields = [
            'address', 'date_of_birth', 'gender',
            'blood_group', 'medical_history', 'allergies'
        ] 