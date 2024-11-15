from django.contrib import admin
from .models import User

# Register your models here.
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'nombre', 'max_score')
    list_display_links = ('id',)
    list_filter = ('max_score',)
    
    
admin.site.register(User, UserAdmin)