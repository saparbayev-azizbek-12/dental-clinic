from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WorkDayViewSet

router = DefaultRouter()
router.register(r'schedules', WorkDayViewSet)

urlpatterns = [
    path('', include(router.urls)),
]
