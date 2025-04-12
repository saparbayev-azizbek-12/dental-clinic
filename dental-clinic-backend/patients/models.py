from django.db import models
from django.conf import settings

class Patient(models.Model):
    """Patient profile model"""
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='patient_profile')
    address = models.CharField('Manzil', max_length=255, blank=True)
    date_of_birth = models.DateField('Tug\'ilgan sana', null=True, blank=True)
    gender = models.CharField('Jins', max_length=10, choices=[('male', 'Erkak'), ('female', 'Ayol')], blank=True)
    blood_group = models.CharField('Qon guruhi', max_length=5, blank=True)
    medical_history = models.TextField('Tibbiy tarix', blank=True)
    allergies = models.TextField('Allergiyalar', blank=True)
    created_at = models.DateTimeField('Yaratilgan sana', auto_now_add=True)
    updated_at = models.DateTimeField('O\'zgartirilgan sana', auto_now=True)

    class Meta:
        verbose_name = 'Bemor'
        verbose_name_plural = 'Bemorlar'

    def __str__(self):
        return f"{self.user.first_name} {self.user.last_name}"

    @property
    def full_name(self):
        return f"{self.user.first_name} {self.user.last_name}"

    @property
    def age(self):
        """Calculate patient age"""
        from datetime import date
        if not self.date_of_birth:
            return None
        today = date.today()
        return today.year - self.date_of_birth.year - (
            (today.month, today.day) < (self.date_of_birth.month, self.date_of_birth.day)
        ) 