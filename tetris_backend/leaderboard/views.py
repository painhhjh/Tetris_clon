from rest_framework import viewsets
from .serializer import UserSerializer
from .models import User
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all().order_by('-max_score')
    serializer_class = UserSerializer
    http_method_names = ['get', 'post', 'patch']