from django.urls import path
from .views import (
    PatientListAPIView,
    PatientDetailAPIView,
    PatientCreateAPIView,
    PatientUpdateAPIView,
)

urlpatterns = [
    path('', PatientListAPIView.as_view(), name='patient-list'),
    path('create/', PatientCreateAPIView.as_view(), name='patient-create'),
    path('<int:pk>/', PatientDetailAPIView.as_view(), name='patient-detail'),
    path('<int:pk>/update/', PatientUpdateAPIView.as_view(), name='patient-update'),
] 