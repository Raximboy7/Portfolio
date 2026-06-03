"""Asosiy URL konfiguratsiyasi."""
from django.urls import path

from portfolio import views

urlpatterns = [
    path("", views.index, name="index"),
    path("aloqa/", views.contact_page, name="contact"),
    path("robots.txt", views.robots_txt, name="robots_txt"),
    path("sitemap.xml", views.sitemap_xml, name="sitemap_xml"),
    path("api/contact/", views.contact_api, name="contact_api"),
]
