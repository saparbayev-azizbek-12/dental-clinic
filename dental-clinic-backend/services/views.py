from rest_framework import generics, permissions, filters
from rest_framework.response import Response
from accounts.permissions import IsAdmin
from .models import ServiceCategory, Service, AppointmentService
from .serializers import ServiceCategorySerializer, ServiceSerializer, AppointmentServiceSerializer

class ServiceCategoryListCreateAPIView(generics.ListCreateAPIView):
    """
    List all service categories or create a new one
    """
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['name']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

class ServiceCategoryDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service category
    """
    queryset = ServiceCategory.objects.all()
    serializer_class = ServiceCategorySerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]

class ServiceListCreateAPIView(generics.ListCreateAPIView):
    """
    List all services or create a new one
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['name', 'price', 'category__name']
    
    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        queryset = Service.objects.all()
        
        # Filter by category if provided
        category_id = self.request.query_params.get('category')
        if category_id:
            queryset = queryset.filter(category_id=category_id)
        
        # Filter by active status
        is_active = self.request.query_params.get('is_active')
        if is_active in ['true', 'True', '1']:
            queryset = queryset.filter(is_active=True)
        
        return queryset
    
    def get_serializer_context(self):
        return {'request': self.request}

class ServiceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service
    """
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdmin()]
        return [permissions.IsAuthenticated()]
    
    def get_serializer_context(self):
        return {'request': self.request}

class AppointmentServiceListCreateAPIView(generics.ListCreateAPIView):
    """
    List all services for an appointment or add a new service
    """
    serializer_class = AppointmentServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        appointment_id = self.kwargs.get('appointment_id')
        return AppointmentService.objects.filter(appointment_id=appointment_id)
    
    def perform_create(self, serializer):
        appointment_id = self.kwargs.get('appointment_id')
        serializer.save(appointment_id=appointment_id)

class AppointmentServiceDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update or delete a service for an appointment
    """
    serializer_class = AppointmentServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        appointment_id = self.kwargs.get('appointment_id')
        return AppointmentService.objects.filter(appointment_id=appointment_id) 