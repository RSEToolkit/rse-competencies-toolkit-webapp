"""Admin module for the main app."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import SkillLevel, User

admin.site.register(User, UserAdmin)


@admin.register(SkillLevel)
class SkillLevelAdmin(admin.ModelAdmin[SkillLevel]):
    """Admin class for skill levels."""

    list_display = ("name",)
    search_fields = ("name",)
    ordering = ("name",)
