"""portfolio app uchun URL'lar (config/urls.py da bevosita ulangan)."""
from django.urls import path

from . import views

app_name = "portfolio"

urlpatterns = [
    path("", views.index, name="index"),
    path("aloqa/", views.contact_page, name="contact"),
    path("api/contact/", views.contact_api, name="contact_api"),
]
