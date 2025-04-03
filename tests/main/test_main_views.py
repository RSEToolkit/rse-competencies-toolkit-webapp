"""Test suite for the main views.

This test module includes tests for main views of the app ensuring that:
  - The correct templates are used.
  - The correct status codes are returned.
"""

import pytest
from django.urls import reverse

from .view_utils import LoginRequiredMixin, TemplateOkMixin


class TestIndex(TemplateOkMixin):
    """Test suite for the index view."""

    _template_name = "main/index.html"

    def _get_url(self):
        return reverse("index")


class TestPrivacy(TemplateOkMixin):
    """Test suite for the privacy view."""

    _template_name = "main/privacy.html"

    def _get_url(self):
        return reverse("privacy")


@pytest.mark.xfail
class TestCreateUserView(LoginRequiredMixin, TemplateOkMixin):
    """Test suite for the CreateUserView."""

    _template_name = "main/create_user.html"

    def _get_url(self):
        return reverse("create_user")
