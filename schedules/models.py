from django.db import models
from users.models import User

# Create your models here.
class Work_days(models.Model):
    doctor_id = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField()
    times = models.JSONField()