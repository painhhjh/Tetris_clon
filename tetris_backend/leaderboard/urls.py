from django.urls import path, include
from rest_framework.documentation import include_docs_urls
from rest_framework import routers
from leaderboard import views

router = routers.DefaultRouter()
router.register(r'usuarios', views.UserView, 'usuarios')

urlpatterns = [
    path("api/", include(router.urls)),
    #path("docs/", include_docs_urls(title=" API")),
]