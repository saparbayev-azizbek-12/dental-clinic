from django.urls import path
from . import views

urlpatterns = [
    # Service Categories
    path('categories/', views.ServiceCategoryListCreateAPIView.as_view(), name='service-category-list'),
    path('categories/<int:pk>/', views.ServiceCategoryDetailAPIView.as_view(), name='service-category-detail'),
    
    # Services
    path('', views.ServiceListCreateAPIView.as_view(), name='service-list'),
    path('<int:pk>/', views.ServiceDetailAPIView.as_view(), name='service-detail'),
    
    # Appointment Services
    path('appointments/<int:appointment_id>/services/', views.AppointmentServiceListCreateAPIView.as_view(), name='appointment-service-list'),
    path('appointments/<int:appointment_id>/services/<int:pk>/', views.AppointmentServiceDetailAPIView.as_view(), name='appointment-service-detail'),
] 