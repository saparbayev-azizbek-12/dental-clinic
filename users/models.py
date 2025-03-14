from django.db import models
from django.contrib.auth.models import AbstractUser, Group, Permission

class roles(models.TextChoices):
    ADMIN = 'admin', 'Admin'
    PATIENT = 'patient', 'Patient'
    DOCTOR = 'doctor', 'Doctor'

# Create your models here.
class User(AbstractUser):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(max_length=100)
    role = models.CharField(
        max_length=50,
        choices=roles.choices,
        default=roles.PATIENT,
    )
    phone = models.CharField(max_length=15)
    is_staff = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    photo = models.FileField(upload_to='users/', default='users/default.png', null=True, blank=True)

    groups = models.ManyToManyField(Group, related_name="custom_user_groups", blank=True)
    user_permissions = models.ManyToManyField(Permission, related_name="custom_user_permissions", blank=True)

    def __str__(self):
        return self.username