from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ['get_patient_name', 'get_email', 'get_phone', 'date_of_birth', 'gender', 'created_at']
    list_filter = ['gender', 'created_at']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'user__phone_number']
    readonly_fields = ['created_at', 'updated_at']
    
    def get_patient_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_patient_name.short_description = 'Bemor'
    
    def get_email(self, obj):
        return obj.user.email
    get_email.short_description = 'Email'
    
    def get_phone(self, obj):
        return obj.user.phone_number
    get_phone.short_description = 'Telefon' 