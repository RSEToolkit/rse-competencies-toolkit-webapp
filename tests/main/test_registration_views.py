"""Test suite for the registration views."""

from http import HTTPStatus

import pytest
from django.core import mail
from django.urls import reverse
from pytest_django.asserts import assertContains, assertNotContains

from .view_utils import TemplateOkMixin


@pytest.fixture
def password_reset_uid_and_token(client, user):
    """Returns the uid and token for password reset."""
    response = client.post(reverse("password_reset"), data={"email": user.email})
    token = response.context[0]["token"]
    uid = response.context[0]["uid"]

    return uid, token


@pytest.fixture
def password_reset_url(password_reset_uid_and_token):
    """Returns the password reset URL."""
    uid, token = password_reset_uid_and_token
    return reverse("password_reset_confirm", kwargs={"uidb64": uid, "token": token})


@pytest.fixture
def set_password_url(client, password_reset_uid_and_token, password_reset_url):
    """Returns the set password URL."""
    uid, _ = password_reset_uid_and_token
    client.get(password_reset_url)
    return reverse(
        "password_reset_confirm", kwargs={"uidb64": uid, "token": "set-password"}
    )


class TestPasswordReset(TemplateOkMixin):
    """Test suite for the password_reset views."""

    _template_name = "registration/password_reset_form.html"

    def _get_url(self):
        return reverse("password_reset")

    def test_post(self, client, user):
        """Test the view POST request redirects correctly."""
        # Request a password reset email
        response = client.post(self._get_url(), data={"email": user.email})

        # Assert redirects to password_reset/done
        assert response.status_code == HTTPStatus.FOUND
        assert response.url == reverse("password_reset_done")

    def test_password_reset_email_and_subject(
        self, client, user, password_reset_url, set_password_url
    ):
        """Test the password reset email and subject templates."""
        # Verify the generated email against the expected templates
        with open("main/templates/registration/password_reset_subject.txt") as f:
            expected_email_subject = f.read()
        with open("main/templates/registration/password_reset_email.html") as f:
            expected_email_content = f.read()
            # Replace template variables
            expected_email_content = expected_email_content.replace(
                "{{ email }}", user.email
            )
            expected_email_content = expected_email_content.replace(
                "{{ protocol }}", "http"
            )
            expected_email_content = expected_email_content.replace(
                "{{ domain }}", "testserver"
            )
            expected_email_content = expected_email_content.replace(
                "{% url 'password_reset_confirm' uidb64=uid token=token %}",
                password_reset_url,
            )

        assert len(mail.outbox) == 1
        generated_email = mail.outbox[0]
        assert generated_email.subject == expected_email_subject.strip()
        assert generated_email.body.strip() == expected_email_content.strip()
        # Now we can use the token to get the password change form
        response = client.get(password_reset_url)
        assert response.status_code == HTTPStatus.FOUND
        assert response.url == set_password_url


class TestPasswordResetDone(TemplateOkMixin):
    """Test suite for the password_reset_done views."""

    _template_name = "registration/password_reset_done.html"

    def _get_url(self):
        return reverse("password_reset_done")


class TestPasswordResetConfirm(TemplateOkMixin):
    """Test suite for the password_reset_confirm views."""

    _template_name = "registration/password_reset_confirm.html"

    def _get_url(self):
        return reverse(
            "password_reset_confirm", kwargs={"token": "some", "uidb64": "thing"}
        )

    def test_get(self, client, set_password_url):
        """Test the view GET request fails and succeeds depending on the token."""
        # Expect our custom error page if an incorrect token/uid is used
        response = client.get(self._get_url())
        assertContains(response, "<h1>Password reset failed</h1>")

        # Expect our custom password_reset_confirm page
        response = client.get(set_password_url)
        assertNotContains(response, "Password reset failed")

    def test_post(self, client, set_password_url):
        """Test the POST request."""
        # Set the new password
        # Note that this needs to be sufficiently strong to be accepted
        response = client.post(
            set_password_url,
            data={
                "new_password1": "bkjbkjwdnwqkldnwkjfdnqlkecf",
                "new_password2": "bkjbkjwdnwqkldnwkjfdnqlkecf",
            },
        )
        assert response.status_code == HTTPStatus.FOUND
        assert response.url == reverse("password_reset_complete")


class TestPasswordResetComplete(TemplateOkMixin):
    """Test suite for the password_reset_complete views."""

    _template_name = "registration/password_reset_complete.html"

    def _get_url(self):
        return reverse("password_reset_complete")
