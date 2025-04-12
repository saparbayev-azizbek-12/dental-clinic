from django.db import models

class ServiceCategory(models.Model):
    """Category for dental services"""
    name = models.CharField('Kategoriya nomi', max_length=100)
    description = models.TextField('Tavsif', blank=True)
    created_at = models.DateTimeField('Yaratilgan sana', auto_now_add=True)
    updated_at = models.DateTimeField('O\'zgartirilgan sana', auto_now=True)
    
    class Meta:
        verbose_name = 'Xizmat kategoriyasi'
        verbose_name_plural = 'Xizmat kategoriyalari'
        ordering = ['name']
    
    def __str__(self):
        return self.name

class Service(models.Model):
    """Dental service model"""
    category = models.ForeignKey(ServiceCategory, on_delete=models.CASCADE, related_name='services', verbose_name='Kategoriya')
    name = models.CharField('Xizmat nomi', max_length=200)
    description = models.TextField('Tavsif')
    price = models.DecimalField('Narx', max_digits=10, decimal_places=2)
    duration = models.PositiveIntegerField('Davomiyligi (minutlar)', help_text='Xizmat davomiyligi minutlarda')
    image = models.ImageField('Rasm', upload_to='service_images/', blank=True, null=True)
    is_active = models.BooleanField('Faol', default=True)
    created_at = models.DateTimeField('Yaratilgan sana', auto_now_add=True)
    updated_at = models.DateTimeField('O\'zgartirilgan sana', auto_now=True)
    
    class Meta:
        verbose_name = 'Xizmat'
        verbose_name_plural = 'Xizmatlar'
        ordering = ['category', 'name']
    
    def __str__(self):
        return f"{self.name} - {self.price}"

class AppointmentService(models.Model):
    """Services provided during an appointment"""
    appointment = models.ForeignKey('appointments.Appointment', on_delete=models.CASCADE, related_name='services')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField('Miqdor', default=1)
    price = models.DecimalField('Narx', max_digits=10, decimal_places=2, help_text='Xizmat ko\'rsatilgan vaqtdagi narx')
    notes = models.TextField('Izohlar', blank=True)
    
    class Meta:
        verbose_name = 'Ko\'rsatilgan xizmat'
        verbose_name_plural = 'Ko\'rsatilgan xizmatlar'
    
    def __str__(self):
        return f"{self.service.name} - {self.appointment}"
    
    @property
    def total_price(self):
        """Calculate total price based on quantity"""
        return self.price * self.quantity 