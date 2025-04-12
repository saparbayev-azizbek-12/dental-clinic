import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from .models import Appointment
from doctors.models import Doctor

User = get_user_model()

class AppointmentConsumer(AsyncWebsocketConsumer):
    """WebSocket consumer for real-time appointment scheduling"""
    
    async def connect(self):
        """Handle WebSocket connection"""
        # Get doctor_id from URL route
        self.doctor_id = self.scope['url_route']['kwargs']['doctor_id']
        
        # Set room group name based on doctor
        self.room_group_name = f'appointments_{self.doctor_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        # Accept the connection
        await self.accept()
        
        # Send current availability to the newly connected client
        if self.scope['user'].is_authenticated:
            await self.send_initial_data()
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnect"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Handle messages received from WebSocket
        Supports: 
        - check_availability: Check if a time slot is available
        - book_appointment: Book an appointment
        """
        data = json.loads(text_data)
        msg_type = data.get('type')
        
        if msg_type == 'check_availability':
            # Check if a time slot is available
            date = data.get('date')
            time = data.get('time')
            
            is_available = await self.check_availability(date, time)
            
            # Send availability status back to client
            await self.send(text_data=json.dumps({
                'type': 'availability_status',
                'is_available': is_available,
                'date': date,
                'time': time
            }))
            
        elif msg_type == 'book_appointment':
            # Attempt to book an appointment
            patient_id = data.get('patient_id')
            date = data.get('date')
            time = data.get('time')
            reason = data.get('reason', '')
            
            success, message = await self.book_appointment(
                patient_id=patient_id,
                date=date,
                time=time,
                reason=reason
            )
            
            # Notify client about booking result
            await self.send(text_data=json.dumps({
                'type': 'booking_result',
                'success': success,
                'message': message
            }))
            
            # If booking was successful, notify all connected clients
            if success:
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'appointment_update',
                        'action': 'booked',
                        'date': date,
                        'time': time
                    }
                )
    
    async def appointment_update(self, event):
        """
        Handle appointment updates and send to WebSocket
        This is called when the group receives a message
        """
        # Send update to WebSocket
        await self.send(text_data=json.dumps({
            'type': 'appointment_update',
            'action': event['action'],
            'date': event['date'],
            'time': event['time']
        }))
    
    async def send_initial_data(self):
        """Send initial data to client upon connection"""
        # Get doctor's booked slots
        booked_slots = await self.get_booked_slots()
        
        # Send to client
        await self.send(text_data=json.dumps({
            'type': 'initial_data',
            'booked_slots': booked_slots
        }))
    
    @database_sync_to_async
    def check_availability(self, date, time):
        """Check if a time slot is available for booking"""
        try:
            doctor = Doctor.objects.get(id=self.doctor_id)
            
            # Check if slot is already booked
            is_booked = Appointment.objects.filter(
                doctor=doctor,
                appointment_date=date,
                appointment_time=time,
                status__in=['upcoming', 'in_progress']
            ).exists()
            
            return not is_booked
            
        except Doctor.DoesNotExist:
            return False
    
    @database_sync_to_async
    def book_appointment(self, patient_id, date, time, reason):
        """Attempt to book an appointment with transaction safety"""
        from django.db import transaction
        from patients.models import Patient
        
        try:
            with transaction.atomic():
                doctor = Doctor.objects.select_for_update().get(id=self.doctor_id)
                patient = Patient.objects.get(id=patient_id)
                
                # Check if the slot is already booked (inside transaction)
                is_booked = Appointment.objects.filter(
                    doctor=doctor,
                    appointment_date=date,
                    appointment_time=time,
                    status__in=['upcoming', 'in_progress']
                ).exists()
                
                if is_booked:
                    return False, "Bu vaqt allaqachon band qilingan"
                
                # Create appointment
                appointment = Appointment.objects.create(
                    doctor=doctor,
                    patient=patient,
                    appointment_date=date,
                    appointment_time=time,
                    reason=reason,
                    status='upcoming'
                )
                
                return True, "Navbat muvaffaqiyatli yaratildi"
                
        except Patient.DoesNotExist:
            return False, "Bemor topilmadi"
        except Doctor.DoesNotExist:
            return False, "Shifokor topilmadi"
        except Exception as e:
            return False, str(e)
    
    @database_sync_to_async
    def get_booked_slots(self):
        """Get all booked slots for this doctor"""
        try:
            doctor = Doctor.objects.get(id=self.doctor_id)
            
            # Get all active appointments
            booked_appointments = Appointment.objects.filter(
                doctor=doctor,
                status__in=['upcoming', 'in_progress']
            ).values('appointment_date', 'appointment_time')
            
            # Format into list of date-time strings
            slots = [
                {
                    'date': appt['appointment_date'].isoformat(),
                    'time': appt['appointment_time'].isoformat()
                }
                for appt in booked_appointments
            ]
            
            return slots
            
        except Doctor.DoesNotExist:
            return [] 