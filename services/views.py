from rest_framework import viewsets
from .models import Services, Images
from .serializers import ServiceSerializer, ImageSerializer

class ServiceViewSet(viewsets.ModelViewSet):
    queryset = Services.objects.all()
    serializer_class = ServiceSerializer

class ImageViewSet(viewsets.ModelViewSet):  # Yangi ViewSet
    queryset = Images.objects.all()
    serializer_class = ImageSerializer
