from django.db import transaction
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from accounts.permissions import IsAdmin, IsDoctor, IsPatient, IsAdminOrSelf
from .models import Patient
from .serializers import (
    PatientListSerializer,
    PatientDetailSerializer,
    PatientCreateUpdateSerializer
)

class PatientListAPIView(generics.ListAPIView):
    """
    Bemorlar ro'yxatini ko'rish (faqat admin va shifokorlar uchun)
    """
    serializer_class = PatientListSerializer
    permission_classes = [IsAdmin|IsDoctor]
    
    def get_queryset(self):
        # Admin barcha bemorlarni ko'ra oladi
        if self.request.user.user_type == 'admin':
            return Patient.objects.all()
        
        # Shifokor faqat o'zi navbat qabul qilingan bemorlarni ko'ra oladi
        if self.request.user.user_type == 'doctor':
            from appointments.models import Appointment
            # Get all patients who have appointments with this doctor
            patient_ids = Appointment.objects.filter(
                doctor__user=self.request.user
            ).values_list('patient_id', flat=True).distinct()
            
            return Patient.objects.filter(id__in=patient_ids)
            
        return Patient.objects.none()

class PatientDetailAPIView(generics.RetrieveAPIView):
    """
    Bemor haqida ma'lumot ko'rish (o'zi, shifokor va admin uchun)
    """
    serializer_class = PatientDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin barcha bemorlarni ko'ra oladi
        if user.user_type == 'admin':
            return Patient.objects.all()
            
        # Shifokor faqat o'zi navbat qabul qilingan bemorlarni ko'ra oladi
        if user.user_type == 'doctor':
            from appointments.models import Appointment
            # Get all patients who have appointments with this doctor
            patient_ids = Appointment.objects.filter(
                doctor__user=user
            ).values_list('patient_id', flat=True).distinct()
            
            return Patient.objects.filter(id__in=patient_ids)
            
        # Bemor faqat o'zini ko'ra oladi
        if user.user_type == 'patient':
            try:
                return Patient.objects.filter(user=user)
            except Patient.DoesNotExist:
                return Patient.objects.none()
                
        return Patient.objects.none()

class PatientCreateAPIView(generics.CreateAPIView):
    """
    Bemor profili yaratish (faqat admin uchun)
    """
    serializer_class = PatientCreateUpdateSerializer
    permission_classes = [IsAdmin]
    
    @transaction.atomic
    def perform_create(self, serializer):
        user_id = self.request.data.get('user_id')
        if not user_id:
            return Response(
                {"error": "Foydalanuvchi ID si talab qilinadi"},
                status=status.HTTP_400_BAD_REQUEST
            )
            
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            return Response(
                {"error": "Foydalanuvchi topilmadi"},
                status=status.HTTP_404_NOT_FOUND
            )
            
        if user.user_type != 'patient':
            user.user_type = 'patient'
            user.save(update_fields=['user_type'])
            
        serializer.save(user=user)

class PatientUpdateAPIView(generics.UpdateAPIView):
    """
    Bemor ma'lumotlarini tahrirlash (o'zi va admin uchun)
    """
    queryset = Patient.objects.all()
    serializer_class = PatientCreateUpdateSerializer
    permission_classes = [IsAdminOrSelf]
    
    def get_object(self):
        obj = super().get_object()
        
        # Check if the request user is the patient
        if self.request.user.user_type == 'patient':
            try:
                patient = Patient.objects.get(user=self.request.user)
                if obj.id != patient.id:
                    self.permission_denied(self.request)
            except Patient.DoesNotExist:
                self.permission_denied(self.request)
                
        return obj 