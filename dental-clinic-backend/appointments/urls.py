from django.urls import path
from . import views

urlpatterns = [
    # Appointment endpoints
    path('', views.AppointmentListAPIView.as_view(), name='appointment-list'),
    path('<int:pk>/', views.AppointmentDetailAPIView.as_view(), name='appointment-detail'),
    path('create/', views.AppointmentCreateAPIView.as_view(), name='appointment-create'),
    path('<int:pk>/update/', views.AppointmentUpdateAPIView.as_view(), name='appointment-update'),
    
    # Doctor availability endpoint
    path('doctor/<int:doctor_id>/available-times/<str:date>/', 
         views.DoctorAvailableTimesAPIView.as_view(), 
         name='doctor-available-times'),
    
    # Notification endpoints
    path('notifications/', views.NotificationListAPIView.as_view(), name='notification-list'),
    path('notifications/<int:pk>/read/', views.MarkNotificationReadAPIView.as_view(), name='mark-notification-read'),
] 