import os
from celery import Celery

# Django sozlamalari uchun muhitni o'rnatish
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'clinic.settings')

app = Celery('clinic')

# Celery sozlamalari uchun Django settings modulidan foydalanish
app.config_from_object('django.conf:settings', namespace='CELERY')

# Barcha app'lardan vazifalarni avtomatik yuklash
app.autodiscover_tasks()

@app.task(bind=True)
def debug_task(self):
    print(f'Request: {self.request!r}') 