from rest_framework import viewsets
from .models import Work_days
from .serializers import WorkDaySerializer
from rest_framework.permissions import IsAuthenticated

class WorkDayViewSet(viewsets.ModelViewSet):
    queryset = Work_days.objects.all()
    serializer_class = WorkDaySerializer
    permission_classes = [IsAuthenticated]
