from django.contrib import admin
from .models import Doctor, DoctorSchedule

class DoctorScheduleInline(admin.TabularInline):
    model = DoctorSchedule
    extra = 1

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ['get_doctor_name', 'specialization', 'experience_years', 'working_hours', 'created_at']
    list_filter = ['specialization', 'experience_years']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'specialization']
    readonly_fields = ['created_at', 'updated_at']
    inlines = [DoctorScheduleInline]
    
    def get_doctor_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}"
    get_doctor_name.short_description = 'Shifokor'
    
@admin.register(DoctorSchedule)
class DoctorScheduleAdmin(admin.ModelAdmin):
    list_display = ['doctor', 'get_day_of_week_display', 'start_time', 'end_time', 'is_working_day', 'slot_duration']
    list_filter = ['doctor', 'day_of_week', 'is_working_day']
    search_fields = ['doctor__user__first_name', 'doctor__user__last_name'] 