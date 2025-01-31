"""Admin module for the main app."""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import Category, SkillLevel, User

admin.site.register(User, UserAdmin)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin[Category]):
    """Admin class for the Category model."""

    list_display = ("name", "description", "parent_category")
    search_fields = ("name", "description")
    list_filter = ("parent_category",)
    ordering = ("name",)


@admin.register(SkillLevel)
class SkillLevelAdmin(admin.ModelAdmin[SkillLevel]):
    """Admin class for skill levels."""

    list_display = ("name",)
    search_fields = ("name",)
