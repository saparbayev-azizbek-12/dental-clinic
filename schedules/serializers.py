from rest_framework import serializers
from .models import Work_days

class WorkDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = Work_days
        fields = '__all__'
