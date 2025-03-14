from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ImageViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'images', ImageViewSet, basename='image')

urlpatterns = [
    path('', include(router.urls)),
]
