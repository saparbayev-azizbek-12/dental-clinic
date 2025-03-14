from rest_framework import viewsets
from .models import Appointments
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticatedOrReadOnly

class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointments.objects.all()
    serializer_class = AppointmentSerializer
    premission_classes = [IsAuthenticatedOrReadOnly]

