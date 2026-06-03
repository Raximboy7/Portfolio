"""Asosiy URL konfiguratsiyasi."""
from django.urls import path

from portfolio import views

urlpatterns = [
    path("", views.index, name="index"),
    path("api/contact/", views.contact_api, name="contact_api"),
]
