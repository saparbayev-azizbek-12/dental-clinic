from django.urls import path
from .views import (
    DoctorListAPIView,
    DoctorDetailAPIView,
    DoctorCreateAPIView,
    DoctorUpdateAPIView,
    DoctorScheduleListCreateAPIView,
    DoctorScheduleDetailAPIView,
)

urlpatterns = [
    path('', DoctorListAPIView.as_view(), name='doctor-list'),
    path('create/', DoctorCreateAPIView.as_view(), name='doctor-create'),
    path('<int:pk>/', DoctorDetailAPIView.as_view(), name='doctor-detail'),
    path('<int:pk>/update/', DoctorUpdateAPIView.as_view(), name='doctor-update'),
    path('<int:doctor_id>/schedules/', DoctorScheduleListCreateAPIView.as_view(), name='doctor-schedule-list-create'),
    path('<int:doctor_id>/schedules/<int:pk>/', DoctorScheduleDetailAPIView.as_view(), name='doctor-schedule-detail'),
] 