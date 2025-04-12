from django.urls import path
from .views import (
    UserListAPIView,
    UserCreateAPIView,
    UserDetailAPIView,
    UserUpdateAPIView,
    CurrentUserAPIView,
    ChangeUserTypeAPIView,
)

urlpatterns = [
    path('users/', UserListAPIView.as_view(), name='user-list'),
    path('users/create/', UserCreateAPIView.as_view(), name='user-create'),
    path('users/<int:pk>/', UserDetailAPIView.as_view(), name='user-detail'),
    path('users/<int:pk>/update/', UserUpdateAPIView.as_view(), name='user-update'),
    path('users/<int:pk>/change-type/', ChangeUserTypeAPIView.as_view(), name='user-change-type'),
    path('me/', CurrentUserAPIView.as_view(), name='current-user'),
] 