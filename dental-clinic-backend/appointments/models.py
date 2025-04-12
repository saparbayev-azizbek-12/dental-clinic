from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from patients.models import Patient
from doctors.models import Doctor
from django.utils import timezone
from model_utils import FieldTracker

class Appointment(models.Model):
    """Appointment model for patient-doctor meetings"""
    STATUS_CHOICES = (
        ('upcoming', 'Kutilmoqda'),
        ('in_progress', 'Jarayonda'),
        ('completed', 'Bajarilgan'),
        ('cancelled', 'Bekor qilingan'),
    )
    
    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name='appointments', verbose_name='Bemor')
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='appointments', verbose_name='Shifokor')
    appointment_date = models.DateField('Sana')
    appointment_time = models.TimeField('Vaqt')
    status = models.CharField('Holati', max_length=20, choices=STATUS_CHOICES, default='upcoming')
    reason = models.TextField('Sabab', blank=True)
    notes = models.TextField('Izohlar', blank=True, help_text="Shifokor izohlari")
    created_at = models.DateTimeField('Yaratilgan vaqt', auto_now_add=True)
    updated_at = models.DateTimeField('Yangilangan vaqt', auto_now=True)
    
    tracker = FieldTracker(fields=['status'])
    
    class Meta:
        verbose_name = 'Navbat'
        verbose_name_plural = 'Navbatlar'
        # This ensures no double bookings for the same doctor at the same time
        unique_together = ['doctor', 'appointment_date', 'appointment_time']
        ordering = ['appointment_date', 'appointment_time']
        # Add database index for faster lookups
        indexes = [
            models.Index(fields=['appointment_date']),
            models.Index(fields=['status']),
            models.Index(fields=['doctor', 'appointment_date']),
        ]
    
    def __str__(self):
        return f"{self.patient} - {self.doctor} ({self.appointment_date} {self.appointment_time})"
    
    def is_upcoming(self):
        """Check if appointment is upcoming"""
        return self.status == 'upcoming'
    
    def is_in_progress(self):
        """Check if appointment is in progress"""
        return self.status == 'in_progress'
    
    def is_completed(self):
        """Check if appointment is completed"""
        return self.status == 'completed'
    
    def is_cancelled(self):
        """Check if appointment is cancelled"""
        return self.status == 'cancelled'
    
    def has_conflict(self):
        """Check if there is a scheduling conflict"""
        return Appointment.objects.filter(
            doctor=self.doctor,
            appointment_date=self.appointment_date,
            appointment_time=self.appointment_time,
            status__in=['upcoming', 'in_progress']
        ).exclude(id=self.id).exists()
    
    def save(self, *args, **kwargs):
        """Override save to check for conflicts"""
        if self.has_conflict():
            raise ValueError("Bu vaqt allaqachon band qilingan")
        super().save(*args, **kwargs)

# Notification system for realtime updates
class AppointmentNotification(models.Model):
    """Notifications for appointment changes"""
    appointment = models.ForeignKey(Appointment, on_delete=models.CASCADE, related_name='notifications')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='appointment_notifications')
    message = models.TextField()
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"Notification for {self.recipient} about appointment {self.appointment.id}"

@receiver(post_save, sender=Appointment)
def create_appointment_notification(sender, instance, created, **kwargs):
    """Create notifications when appointment is created or updated"""
    if created:
        # Notify doctor about new appointment
        AppointmentNotification.objects.create(
            appointment=instance,
            recipient=instance.doctor.user,
            message=f"Yangi navbat: {instance.patient.full_name} {instance.appointment_date} {instance.appointment_time} vaqtida"
        )
        
        # Notify patient about confirmation
        AppointmentNotification.objects.create(
            appointment=instance,
            recipient=instance.patient.user,
            message=f"Navbatingiz tasdiqlandi: {instance.doctor} {instance.appointment_date} {instance.appointment_time}"
        )
    else:
        # Status change notification
        if instance.tracker.has_changed('status'):
            old_status = instance.tracker.previous('status')
            new_status = instance.status
            
            # Notify patient about status change
            status_message = f"Navbat holati o'zgardi: {dict(Appointment.STATUS_CHOICES)[old_status]} → {dict(Appointment.STATUS_CHOICES)[new_status]}"
            
            AppointmentNotification.objects.create(
                appointment=instance,
                recipient=instance.patient.user,
                message=status_message
            ) 