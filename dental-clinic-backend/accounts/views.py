from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer, UserUpdateSerializer
from .permissions import IsAdminOrSelf

User = get_user_model()

class UserListAPIView(generics.ListAPIView):
    """Admin foydalanuvchilarga barcha foydalanuvchilarni ko'rish imkonini beradi"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        queryset = User.objects.all()
        user_type = self.request.query_params.get('user_type', None)
        if user_type:
            queryset = queryset.filter(user_type=user_type)
        return queryset

class UserCreateAPIView(generics.CreateAPIView):
    """Foydalanuvchilarni ro'yxatdan o'tkazish uchun API"""
    queryset = User.objects.all()
    serializer_class = UserCreateSerializer
    permission_classes = [permissions.IsAdminUser]

class UserDetailAPIView(generics.RetrieveAPIView):
    """Berilgan ID bo'yicha foydalanuvchi tafsilotlarini ko'rish"""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminOrSelf]

class UserUpdateAPIView(generics.UpdateAPIView):
    """Berilgan ID bo'yicha foydalanuvchi ma'lumotlarini yangilash"""
    queryset = User.objects.all()
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAdminOrSelf]

class CurrentUserAPIView(APIView):
    """Joriy avtorizatsiyalangan foydalanuvchi ma'lumotlarini qaytaradi"""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ChangeUserTypeAPIView(APIView):
    """Foydalanuvchi turini o'zgartirish (faqat admin uchun)"""
    permission_classes = [permissions.IsAdminUser]

    def patch(self, request, pk):
        try:
            user = User.objects.get(pk=pk)
        except User.DoesNotExist:
            return Response({"error": "Foydalanuvchi topilmadi"}, status=status.HTTP_404_NOT_FOUND)
            
        user_type = request.data.get('user_type')
        if not user_type or user_type not in [choice[0] for choice in User.USER_TYPE_CHOICES]:
            return Response({"error": "Noto'g'ri foydalanuvchi turi"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Admin yaratish taqiqlangan
        if user_type == 'admin' and user.user_type != 'admin':
            return Response({"error": "Admin yaratish mumkin emas"}, status=status.HTTP_403_FORBIDDEN)
            
        # Shifokorni bemorga o'zgartirish taqiqlangan
        if user.user_type == 'doctor' and user_type == 'patient':
            return Response({"error": "Shifokorni bemorga o'zgartirish mumkin emas"}, status=status.HTTP_403_FORBIDDEN)
            
        user.user_type = user_type
        user.save()
        
        serializer = UserSerializer(user)
        return Response(serializer.data, status=status.HTTP_200_OK) 