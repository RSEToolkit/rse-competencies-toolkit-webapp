"""Models module for the main app."""

from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for this project."""


class SkillLevel(models.Model):
    """Model for skill levels."""

    name = models.CharField(max_length=50)
