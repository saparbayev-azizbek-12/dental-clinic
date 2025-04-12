from django.contrib import admin
from .models import Appointment, AppointmentNotification

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ['patient', 'doctor', 'appointment_date', 'appointment_time', 'status', 'created_at']
    list_filter = ['status', 'appointment_date', 'doctor']
    search_fields = ['patient__user__first_name', 'patient__user__last_name', 'doctor__user__first_name', 'doctor__user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'appointment_date'

@admin.register(AppointmentNotification)
class AppointmentNotificationAdmin(admin.ModelAdmin):
    list_display = ['recipient', 'get_appointment_details', 'is_read', 'created_at']
    list_filter = ['is_read', 'created_at']
    search_fields = ['recipient__email', 'message']
    readonly_fields = ['created_at']
    
    def get_appointment_details(self, obj):
        return f"{obj.appointment.patient} - {obj.appointment.doctor} ({obj.appointment.appointment_date})"
    get_appointment_details.short_description = 'Navbat' 