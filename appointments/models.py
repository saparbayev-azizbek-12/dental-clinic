from django.db import models
from users.models import User

# Create your models here.

class Appointments(models.Model):
    patient_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient')
    doctor_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor')
    appointment_day = models.DateField()
    appointment_number = models.CharField(max_length=10)
    appointment_status = models.CharField(max_length=20, null=True, blank=True),
    appointment_slug = models.SlugField(max_length=100, null=True, blank=True)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
