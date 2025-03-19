# from django.core import mail

from django.test import TestCase
from pytest_django.asserts import assertTemplateUsed


class TestMainViews(TestCase):
    """Test suite for the main views of the RSE Competencies Toolkit web application.

    This test case includes tests for main views of the app ensurign that the correct
    templates are used
    """

    def test_index(self):
        """Test the index view."""
        with assertTemplateUsed(template_name="main/index.html"):
            response = self.client.get("/")
        assert response.status_code == 200

    def test_privacy(self):
        """Test the privacy page view."""
        with assertTemplateUsed(template_name="main/privacy.html"):
            response = self.client.get("/privacy/")
        self.assertEqual(response.status_code, 200)
