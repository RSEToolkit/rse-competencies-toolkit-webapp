"""Urls module for the main app."""

from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("privacy/", views.privacy, name="privacy"),
]
