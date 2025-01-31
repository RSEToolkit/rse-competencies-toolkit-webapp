"""Models module for the main app."""

from django.contrib.auth.models import AbstractUser
from django.core.exceptions import ValidationError
from django.db import models
from django.utils.translation import gettext_lazy as _


class User(AbstractUser):
    """Custom user model for this project."""


class Category(models.Model):
    """Model for categories."""

    name = models.CharField(max_length=50)
    description = models.CharField(max_length=200)
    parent_category = models.ForeignKey(
        "self",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        limit_choices_to={"parent_category": None},
    )

    def __str__(self) -> str:
        """Return the name of the category."""
        return self.name

    def clean(self) -> None:
        """Validate the category instance."""
        if self.parent_category == self:
            raise ValidationError(
                {"parent_category": _("A category cannot be its own parent.")}
            )
        if self.parent_category and self.pk and self.category_set.all().exists():
            raise ValidationError(
                {
                    "parent_category": _(
                        "This is a parent category so can't be made into a subcategory."
                    )
                }
            )


class SkillLevel(models.Model):
    """Model for skill levels."""

    name = models.CharField(max_length=50)
