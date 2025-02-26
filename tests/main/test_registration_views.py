# from django.core import mail
import re

from django.core import mail
from django.test import TestCase
from pytest_django.asserts import assertTemplateUsed

from main.models import User


class TestRegistrationViews(TestCase):
    """Test suite for the registration views.

    This test case includes tests for the password reset functionality,
    ensuring that the password reset form is rendered correctly and that
    the password reset submission process works as expected, including
    email generation and redirection.
    """

    def setUp(self):
        """Set up the test environment with a test user with predefined attributes.

        This is required to allow the email generation test to work.
        """
        self.test_user = User.objects.create_user(
            first_name="test",
            last_name="user",
            email="test.user@mail.com",
            password="1234",
            username="testuser",
        )

    # Password reset tests
    def test_password_reset(self):
        """Test the password_reset_form view."""
        with assertTemplateUsed(template_name="registration/password_reset_form.html"):
            response = self.client.get("/accounts/password_reset/")
        self.assertEqual(response.status_code, 200)

    def test_password_reset_submit(self):
        """Tests the templates are used when a password reset email is requested."""
        response = self.client.post(
            path="/accounts/password_reset/", data={"email": self.test_user.email}
        )

        # Assert redirects to password_reset/done
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, "/accounts/password_reset/done/")

        # Verify the generated email against the expected template
        with open("main/templates/registration/password_reset_subject.txt") as f:
            expected_email_subject = f.read()

        with open("main/templates/registration/password_reset_email.html") as f:
            expected_email_body = f.read()
        expected_email_body = re.sub(
            "\{\{ email \}\}", self.test_user.email, expected_email_body
        )
        expected_email_body = re.sub("\{\{ protocol \}\}", "http", expected_email_body)
        expected_email_body = re.sub(
            "\{\{ domain \}\}", "testserver", expected_email_body
        )
        expected_email_body = re.sub("\{\%.*\%\}", "", expected_email_body)

        self.assertEqual(len(mail.outbox), 1)
        actual_email = mail.outbox[0]
        self.assertEqual(actual_email.subject, expected_email_subject.strip())
        self.assertRegex(actual_email.body, f"{expected_email_body.strip()}.*")

    # ------------------------------------------------------------

    # Password reset done tests
    def test_password_reset_done(self):
        """Test the privacy page view."""
        with assertTemplateUsed(template_name="registration/password_reset_done.html"):
            response = self.client.get("/accounts/password_reset/done/")
        self.assertEqual(response.status_code, 200)
