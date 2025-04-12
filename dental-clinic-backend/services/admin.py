from django.contrib import admin
from .models import ServiceCategory, Service, AppointmentService

@admin.register(ServiceCategory)
class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at')
    search_fields = ('name',)

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'duration', 'is_active')
    list_filter = ('category', 'is_active')
    search_fields = ('name', 'description')

@admin.register(AppointmentService)
class AppointmentServiceAdmin(admin.ModelAdmin):
    list_display = ('service', 'appointment', 'quantity', 'price', 'total_price')
    list_filter = ('service__category',)
    search_fields = ('service__name', 'appointment__patient__user__first_name')
    readonly_fields = ('total_price',) 