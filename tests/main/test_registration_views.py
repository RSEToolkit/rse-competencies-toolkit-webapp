# from django.core import mail
from django.core import mail
from django.test import TestCase
from django.urls import reverse
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

    def test_password_reset(self):
        """Test the password_reset_form view."""
        with assertTemplateUsed(template_name="registration/password_reset_form.html"):
            response = self.client.get("/accounts/password_reset/")
        self.assertEqual(response.status_code, 200)

    def test_password_reset_done(self):
        """Test the password_reset_done view."""
        with assertTemplateUsed(template_name="registration/password_reset_done.html"):
            response = self.client.get("/accounts/password_reset/done/")
        self.assertEqual(response.status_code, 200)

    def test_password_reset_email_and_subject(self):
        """Test the password reset email and subject templates."""
        # Request a password reset email
        response = self.client.post(
            path="/accounts/password_reset/", data={"email": self.test_user.email}
        )
        # Assert redirects to password_reset/done
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, "/accounts/password_reset/done/")

        # Get the token and userid from the response
        token = response.context[0]["token"]
        uid = response.context[0]["uid"]
        generated_reset_url = reverse(
            "password_reset_confirm", kwargs={"token": token, "uidb64": uid}
        )

        # Verify the generated email against the expected templates
        with open("main/templates/registration/password_reset_subject.txt") as f:
            expected_email_subject = f.read()
        with open("main/templates/registration/password_reset_email.html") as f:
            expected_email_content = f.read()
            # Replace template variables
            expected_email_content = expected_email_content.replace(
                "{{ email }}", self.test_user.email
            )
            expected_email_content = expected_email_content.replace(
                "{{ protocol }}", "http"
            )
            expected_email_content = expected_email_content.replace(
                "{{ domain }}", "testserver"
            )
            expected_email_content = expected_email_content.replace(
                "{% url 'password_reset_confirm' uidb64=uid token=token %}",
                generated_reset_url,
            )

        self.assertEqual(len(mail.outbox), 1)
        generated_email = mail.outbox[0]
        self.assertEqual(generated_email.subject, expected_email_subject.strip())
        self.assertEqual(generated_email.body.strip(), expected_email_content.strip())

        # Now we can use the token to get the password change form
        set_password_url = f"/accounts/reset/{uid}/set-password/"
        response = self.client.get(generated_reset_url)
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, set_password_url)

        return set_password_url

    def test_password_reset_confirm(self):
        """Test the password_reset_confirm view."""
        set_password_url = self.test_password_reset_email_and_subject()

        # Expect out custom error page if an incorrect token/uid is used
        with assertTemplateUsed(
            template_name="registration/password_reset_confirm.html"
        ):
            response = self.client.get(
                reverse(
                    "password_reset_confirm",
                    kwargs={"token": "some", "uidb64": "thing"},
                )
            )
        self.assertEqual(response.status_code, 200)
        self.assertContains(response, "Password reset failed")

        # Expect our custom password_reset_confirm page
        with assertTemplateUsed(
            template_name="registration/password_reset_confirm.html"
        ):
            response = self.client.get(set_password_url)
        self.assertEqual(response.status_code, 200)
        self.assertNotContains(response, "Password reset failed")

    def test_password_reset_complete(self):
        """Test the password_reset_complete view."""
        set_password_url = self.test_password_reset_email_and_subject()

        expected_redirect_url = "/accounts/reset/done/"

        # Set the new password
        # Note that this needs to be sufficiently strong to be accepted
        response = self.client.post(
            set_password_url,
            data={
                "new_password1": "bkjbkjwdnwqkldnwkjfdnqlkecf",
                "new_password2": "bkjbkjwdnwqkldnwkjfdnqlkecf",
            },
        )
        self.assertEqual(response.status_code, 302)
        self.assertEqual(response.url, expected_redirect_url)

        # Expect our custom password_reset_complete page
        with assertTemplateUsed(
            template_name="registration/password_reset_complete.html"
        ):
            response = self.client.get(expected_redirect_url)
        self.assertEqual(response.status_code, 200)
