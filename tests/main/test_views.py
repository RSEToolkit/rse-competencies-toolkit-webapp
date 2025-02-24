from pytest_django.asserts import assertTemplateUsed


def test_index(client, admin_client):
    """Test the index view."""
    with assertTemplateUsed(template_name="main/index.html"):
        response = client.get("/")
    assert response.status_code == 200


def test_privacy(client, admin_client):
    """Test the privacy page view."""
    with assertTemplateUsed(template_name="main/privacy.html"):
        response = client.get("/privacy/")
    assert response.status_code == 200


def test_login(client, admin_client):
    """Test the privacy page view."""
    with assertTemplateUsed(template_name="registration/login.html"):
        response = client.get("/accounts/login/")
    assert response.status_code == 200


def test_login_submit(client, admin_client):
    """Test the privacy page view."""
    response = client.post(
        path="/accounts/login/", data={"username": "username", "password": "password"}
    )
    print(response.content)
    assert response.status_code == 200


def test_password_reset(client, admin_client):
    """Test the privacy page view."""
    with assertTemplateUsed(template_name="registration/password_reset_form.html"):
        response = client.get("/accounts/password_reset/")
    assert response.status_code == 200


def test_password_reset_submit(client, admin_client):
    """Test the privacy page view."""
    response = client.post(
        path="/accounts/password_reset/", data={"email": "user@mail.com"}
    )

    # Assert redirects to password_reset/done
    assert response.status_code == 302
    assert response.url == "/accounts/password_reset/done/"
