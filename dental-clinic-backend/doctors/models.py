from django.db import models
from django.conf import settings

class Doctor(models.Model):
    """Doctor profile model"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='doctor_profile')
    specialization = models.CharField('Mutaxassislik', max_length=100)
    experience_years = models.PositiveIntegerField('Tajriba yillari')
    description = models.TextField('Tavsif', blank=True)
    working_hours = models.CharField('Ish vaqti', max_length=200, blank=True, help_text="Masalan: 09:00-18:00")
    photo = models.ImageField('Rasm', upload_to='doctor_photos/', blank=True, null=True)
    created_at = models.DateTimeField('Yaratilgan sana', auto_now_add=True)
    updated_at = models.DateTimeField('O\'zgartirilgan sana', auto_now=True)

    class Meta:
        verbose_name = 'Shifokor'
        verbose_name_plural = 'Shifokorlar'

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name} - {self.specialization}"

class DoctorSchedule(models.Model):
    """Doctor's weekly schedule"""
    DAYS_OF_WEEK = (
        (0, 'Dushanba'),
        (1, 'Seshanba'),
        (2, 'Chorshanba'),
        (3, 'Payshanba'),
        (4, 'Juma'),
        (5, 'Shanba'),
        (6, 'Yakshanba'),
    )

    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='schedules')
    day_of_week = models.IntegerField('Hafta kuni', choices=DAYS_OF_WEEK)
    start_time = models.TimeField('Boshlash vaqti')
    end_time = models.TimeField('Tugash vaqti')
    is_working_day = models.BooleanField('Ish kuni', default=True)
    slot_duration = models.IntegerField('Qabul davomiyligi (minutlar)', default=30, help_text="Minutlarda")
    
    class Meta:
        verbose_name = 'Shifokor jadvali'
        verbose_name_plural = 'Shifokor jadvallari'
        unique_together = ['doctor', 'day_of_week']

    def __str__(self):
        return f"{self.doctor} - {self.get_day_of_week_display()} ({self.start_time}-{self.end_time})"
        
    def get_available_slots(self):
        """Available time slots for appointments"""
        if not self.is_working_day:
            return []
            
        slots = []
        current_time = self.start_time
        
        while current_time < self.end_time:
            slots.append(current_time)
            # Add slot_duration minutes to current time
            hours, minutes = current_time.hour, current_time.minute
            minutes += self.slot_duration
            hours += minutes // 60
            minutes = minutes % 60
            
            from datetime import time
            current_time = time(hours, minutes)
            
        return slots 