"""Settings for app deployment in production.

This module contains those settings that are not expected to vary between
deployments. This module is not intended to be used directly but imported into another
module where deployment specific settings are set.
ADMINS and ALLOWED_HOSTS need to be defined in the deployment specific settings module.
"""

import os

from .settings import *  # noqa: F403

DEBUG = False
SECRET_KEY = os.environ["SECRET_KEY"]
SECURE_BROWSER_XSS_FILTER = True
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SECURE_HSTS_SECONDS = 15552000
USE_X_FORWARDED_HOST = True
EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"
EMAIL_HOST = "smtp.sendgrid.net"
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = "apikey"
EMAIL_HOST_PASSWORD = os.getenv("SENDGRID_API_KEY")
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL")
