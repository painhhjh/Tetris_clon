from django.db import models
from django.core import validators

# Create your models here.
class User(models.Model):
    nombre = models.CharField(max_length=50, unique=True)
    max_score = models.IntegerField(validators=[validators.MinValueValidator(1)])
    
    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'
        
    def __str__(self):
        return self.nombre