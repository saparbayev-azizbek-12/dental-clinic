from django.db import models
from users.models import User

# Create your models here.
class Images(models.Model):
    path = models.FileField(upload_to='images/', null=True, blank=True)
    comment = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

class Services(models.Model):
    service_name = models.CharField(max_length=50)
    exp_years = models.IntegerField()
    exp_months = models.IntegerField()
    price = models.FloatField()
    work_image_id = models.ForeignKey(Images, on_delete=models.CASCADE)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)