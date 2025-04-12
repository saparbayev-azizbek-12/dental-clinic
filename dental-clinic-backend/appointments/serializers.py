from rest_framework import serializers
from .models import Appointment, AppointmentNotification
from patients.serializers import PatientListSerializer
from doctors.serializers import DoctorListSerializer

class AppointmentListSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.full_name', read_only=True)
    doctor_name = serializers.CharField(source='doctor.__str__', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'patient_name', 'doctor', 'doctor_name',
            'appointment_date', 'appointment_time', 'status', 'status_display',
            'created_at'
        ]

class AppointmentDetailSerializer(serializers.ModelSerializer):
    patient = PatientListSerializer(read_only=True)
    doctor = DoctorListSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    services = serializers.SerializerMethodField()
    
    class Meta:
        model = Appointment
        fields = [
            'id', 'patient', 'doctor', 'appointment_date', 'appointment_time',
            'status', 'status_display', 'reason', 'notes', 'services', 
            'created_at', 'updated_at'
        ]
    
    def get_services(self, obj):
        from services.serializers import AppointmentServiceSerializer
        services = obj.services.all()
        return AppointmentServiceSerializer(services, many=True).data

class AppointmentCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['patient', 'doctor', 'appointment_date', 'appointment_time', 'reason']
        
    def validate(self, attrs):
        """Validate that appointment time is available"""
        doctor = attrs.get('doctor')
        date = attrs.get('appointment_date')
        time = attrs.get('appointment_time')
        
        # Check for conflicts
        conflict = Appointment.objects.filter(
            doctor=doctor,
            appointment_date=date,
            appointment_time=time,
            status__in=['upcoming', 'in_progress']
        ).exists()
        
        if conflict:
            raise serializers.ValidationError({"appointment_time": "Bu vaqt allaqachon band"})
            
        return attrs

class AppointmentUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = ['status', 'notes']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentNotification
        fields = ['id', 'appointment', 'message', 'is_read', 'created_at'] 