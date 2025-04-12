from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from .models import User

class UserAdmin(BaseUserAdmin):
    """Custom User admin for email-based User model."""
    ordering = ['email']
    list_display = ['email', 'first_name', 'last_name', 'user_type', 'registration_date', 'is_active']
    list_filter = ['user_type', 'is_active', 'is_staff']
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal info'), {'fields': ('first_name', 'last_name', 'phone_number')}),
        (_('Permissions'), {'fields': ('is_active', 'is_staff', 'is_superuser', 'user_type')}),
        (_('Important dates'), {'fields': ('last_login', 'registration_date')}),
    )
    readonly_fields = ['registration_date']
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2', 'first_name', 'last_name', 'phone_number', 'user_type'),
        }),
    )
    search_fields = ['email', 'first_name', 'last_name', 'phone_number']

admin.site.register(User, UserAdmin) 