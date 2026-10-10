"""portfolio app uchun URL'lar (config/urls.py da bevosita ulangan)."""
from django.urls import path

from . import views

app_name = "portfolio"

urlpatterns = [
    path("", views.index, name="index"),
    path("taqdimot/", views.taqdimot, name="taqdimot"),
    path("qollanmalar/", views.guides_page, name="guides"),
    path("qollanmalar/<slug:slug>/", views.guide_detail, name="guide"),
    path("yangiliklar/", views.news_page, name="news"),
    path("aloqa/", views.contact_page, name="contact"),
    path("api/contact/", views.contact_api, name="contact_api"),
]
