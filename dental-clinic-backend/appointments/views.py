from django.db import transaction
from django.utils import timezone
from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from accounts.permissions import IsAdmin, IsDoctor, IsPatient
from .models import Appointment, AppointmentNotification
from .serializers import (
    AppointmentListSerializer,
    AppointmentDetailSerializer,
    AppointmentCreateSerializer,
    AppointmentUpdateSerializer,
    NotificationSerializer
)
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

class AppointmentListAPIView(generics.ListAPIView):
    """
    List all appointments with filtering by role:
    - Admin: All appointments
    - Doctor: Only their appointments
    - Patient: Only their appointments
    """
    serializer_class = AppointmentListSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter]
    search_fields = ['patient__user__first_name', 'patient__user__last_name', 'doctor__user__first_name', 'doctor__user__last_name']
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all appointments
        if user.user_type == 'admin':
            return Appointment.objects.all()
            
        # Doctor can see only their appointments
        if user.user_type == 'doctor':
            try:
                from doctors.models import Doctor
                doctor = Doctor.objects.get(user=user)
                return Appointment.objects.filter(doctor=doctor)
            except Doctor.DoesNotExist:
                return Appointment.objects.none()
                
        # Patient can see only their appointments
        if user.user_type == 'patient':
            try:
                from patients.models import Patient
                patient = Patient.objects.get(user=user)
                return Appointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return Appointment.objects.none()
                
        return Appointment.objects.none()

class AppointmentDetailAPIView(generics.RetrieveAPIView):
    """
    Retrieve a specific appointment, with permissions:
    - Admin: Any appointment
    - Doctor: Their appointments
    - Patient: Their appointments
    """
    serializer_class = AppointmentDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can see all appointments
        if user.user_type == 'admin':
            return Appointment.objects.all()
            
        # Doctor can see only their appointments
        if user.user_type == 'doctor':
            try:
                from doctors.models import Doctor
                doctor = Doctor.objects.get(user=user)
                return Appointment.objects.filter(doctor=doctor)
            except Doctor.DoesNotExist:
                return Appointment.objects.none()
                
        # Patient can see only their appointments
        if user.user_type == 'patient':
            try:
                from patients.models import Patient
                patient = Patient.objects.get(user=user)
                return Appointment.objects.filter(patient=patient)
            except Patient.DoesNotExist:
                return Appointment.objects.none()
                
        return Appointment.objects.none()

class AppointmentCreateAPIView(generics.CreateAPIView):
    """
    Create a new appointment
    - Patients can book appointments
    - Admins can book on behalf of patients
    """
    serializer_class = AppointmentCreateSerializer
    permission_classes = [IsAdmin|IsPatient]
    
    @transaction.atomic
    def perform_create(self, serializer):
        user = self.request.user
        
        # If patient is creating their own appointment
        if user.user_type == 'patient' and 'patient' not in self.request.data:
            try:
                from patients.models import Patient
                patient = Patient.objects.get(user=user)
                serializer.save(patient=patient)
                
                # Notify about new appointment via WebSocket
                self.notify_appointment_created(serializer.instance)
                return
            except Patient.DoesNotExist:
                raise PermissionDenied("Bemor profili topilmadi")
        
        # Otherwise, save as provided (admin case)
        appointment = serializer.save()
        self.notify_appointment_created(appointment)
    
    def notify_appointment_created(self, appointment):
        """Notify connected clients about new appointment"""
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'appointments_{appointment.doctor.id}',
            {
                'type': 'appointment_update',
                'action': 'booked',
                'date': appointment.appointment_date.isoformat(),
                'time': appointment.appointment_time.isoformat()
            }
        )

class AppointmentUpdateAPIView(generics.UpdateAPIView):
    """
    Update an appointment
    - Doctors can update status and notes
    - Admins can update any field
    - Patients can cancel their appointments
    """
    serializer_class = AppointmentUpdateSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        
        # Admin can update any appointment
        if user.user_type == 'admin':
            return Appointment.objects.all()
            
        # Doctor can update only their appointments
        if user.user_type == 'doctor':
            try:
                from doctors.models import Doctor
                doctor = Doctor.objects.get(user=user)
                return Appointment.objects.filter(doctor=doctor)
            except Doctor.DoesNotExist:
                return Appointment.objects.none()
                
        # Patient can only cancel their appointments (update status to 'cancelled')
        if user.user_type == 'patient':
            try:
                from patients.models import Patient
                patient = Patient.objects.get(user=user)
                
                # Validate that patient is only cancelling, not changing other fields
                if 'status' in self.request.data and self.request.data['status'] != 'cancelled':
                    self.permission_denied(self.request)
                    
                if 'notes' in self.request.data:
                    self.permission_denied(self.request)
                    
                return Appointment.objects.filter(patient=patient, status='upcoming')
            except Patient.DoesNotExist:
                return Appointment.objects.none()
                
        return Appointment.objects.none()
    
    @transaction.atomic
    def perform_update(self, serializer):
        old_status = serializer.instance.status
        appointment = serializer.save()
        
        # Notify via WebSocket if status changed
        if old_status != appointment.status:
            self.notify_status_change(appointment, old_status)
    
    def notify_status_change(self, appointment, old_status):
        """Notify connected clients about status change"""
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'appointments_{appointment.doctor.id}',
            {
                'type': 'appointment_update',
                'action': 'status_changed',
                'date': appointment.appointment_date.isoformat(),
                'time': appointment.appointment_time.isoformat(),
                'old_status': old_status,
                'new_status': appointment.status
            }
        )

class DoctorAvailableTimesAPIView(APIView):
    """
    Get available times for a doctor on a specific date
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request, doctor_id, date):
        """Get available time slots for doctor on date"""
        try:
            from doctors.models import Doctor, DoctorSchedule
            import datetime
            
            # Parse date
            try:
                date_obj = datetime.datetime.strptime(date, '%Y-%m-%d').date()
            except ValueError:
                return Response(
                    {"error": "Noto'g'ri sana formati. Iltimos, YYYY-MM-DD formatida kiriting"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Get doctor
            doctor = get_object_or_404(Doctor, id=doctor_id)
            
            # Get day of week (0=Monday, 6=Sunday)
            day_of_week = date_obj.weekday()
            
            # Find doctor's schedule for this day
            try:
                schedule = DoctorSchedule.objects.get(doctor=doctor, day_of_week=day_of_week)
                if not schedule.is_working_day:
                    return Response({"available_times": []})
                    
                # Get all slots from schedule
                all_slots = schedule.get_available_slots()
                
                # Get booked appointments for this date and doctor
                booked_times = Appointment.objects.filter(
                    doctor=doctor,
                    appointment_date=date_obj,
                    status__in=['upcoming', 'in_progress']
                ).values_list('appointment_time', flat=True)
                
                # Convert to set for O(1) lookup
                booked_times_set = set(booked_times)
                
                # Filter available slots
                available_times = [
                    slot.strftime('%H:%M')
                    for slot in all_slots
                    if slot not in booked_times_set
                ]
                
                return Response({"available_times": available_times})
                
            except DoctorSchedule.DoesNotExist:
                return Response({"available_times": []})
                
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

class NotificationListAPIView(generics.ListAPIView):
    """
    List notifications for the authenticated user
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AppointmentNotification.objects.filter(
            recipient=self.request.user
        ).order_by('-created_at')

class MarkNotificationReadAPIView(generics.UpdateAPIView):
    """
    Mark a notification as read
    """
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return AppointmentNotification.objects.filter(
            recipient=self.request.user
        )
    
    def update(self, request, *args, **kwargs):
        notification = self.get_object()
        notification.is_read = True
        notification.save()
        serializer = self.get_serializer(notification)
        return Response(serializer.data) 