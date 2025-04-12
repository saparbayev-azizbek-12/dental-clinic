from django.db import transaction
from rest_framework import generics, permissions, status, filters
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from accounts.permissions import IsAdmin, IsDoctor
from .models import Doctor, DoctorSchedule
from .serializers import (
    DoctorListSerializer,
    DoctorDetailSerializer,
    DoctorCreateUpdateSerializer,
    DoctorScheduleSerializer
)

class DoctorListAPIView(generics.ListAPIView):
    """
    Shifokorlar ro'yxatini ko'rish
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorListSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['user__first_name', 'user__last_name', 'specialization']
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        return {'request': self.request}

class DoctorDetailAPIView(generics.RetrieveAPIView):
    """
    Shifokor ma'lumotlarini ko'rish
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_context(self):
        return {'request': self.request}

class DoctorCreateAPIView(generics.CreateAPIView):
    """
    Shifokor profili yaratish (faqat admin uchun)
    """
    serializer_class = DoctorCreateUpdateSerializer
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
            
        if user.user_type != 'doctor':
            user.user_type = 'doctor'
            user.save(update_fields=['user_type'])
            
        serializer.save(user=user)

class DoctorUpdateAPIView(generics.UpdateAPIView):
    """
    Shifokor profilini tahrirlash
    """
    queryset = Doctor.objects.all()
    serializer_class = DoctorCreateUpdateSerializer
    permission_classes = [IsAdmin|IsDoctor]
    
    def get_object(self):
        obj = super().get_object()
        
        # Faqat admin boshqa shifokorni tahrirlashi mumkin
        # Shifokor faqat o'zining profilini tahrirlashi mumkin
        if not self.request.user.is_staff and self.request.user.id != obj.user.id:
            self.permission_denied(self.request)
            
        return obj

class DoctorScheduleListCreateAPIView(generics.ListCreateAPIView):
    """
    Shifokor jadvalini ko'rish va yaratish
    """
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsAdmin|IsDoctor]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return DoctorSchedule.objects.filter(doctor_id=doctor_id)
        
    def perform_create(self, serializer):
        doctor_id = self.kwargs.get('doctor_id')
        doctor = get_object_or_404(Doctor, id=doctor_id)
        
        # Faqat admin yoki shifokorning o'zi jadval yaratishi mumkin
        if not self.request.user.is_staff and self.request.user.id != doctor.user.id:
            self.permission_denied(self.request)
            
        serializer.save(doctor=doctor)

class DoctorScheduleDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Shifokor jadvalini ko'rish, tahrirlash va o'chirish
    """
    serializer_class = DoctorScheduleSerializer
    permission_classes = [IsAdmin|IsDoctor]
    
    def get_queryset(self):
        doctor_id = self.kwargs.get('doctor_id')
        return DoctorSchedule.objects.filter(doctor_id=doctor_id)
        
    def get_object(self):
        queryset = self.get_queryset()
        schedule_id = self.kwargs.get('pk')
        obj = get_object_or_404(queryset, id=schedule_id)
        
        # Faqat admin yoki shifokorning o'zi jadval tahrirlashi mumkin
        if not self.request.user.is_staff and self.request.user.id != obj.doctor.user.id:
            self.permission_denied(self.request)
            
        return obj 