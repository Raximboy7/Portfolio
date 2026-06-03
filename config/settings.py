"""
Django sozlamalari — VS Code uslubidagi portfolio sayti (ibrohimov-dev.uz).

Maxfiy qiymatlar .env faylidan o'qiladi (python-dotenv). Namuna uchun .env.example ga qarang.
"""
import os
from pathlib import Path

from django.core.exceptions import ImproperlyConfigured
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent

# .env faylini yuklash (agar mavjud bo'lsa)
load_dotenv(BASE_DIR / ".env")


def env_bool(name: str, default: str = "False") -> bool:
    return os.getenv(name, default).strip().lower() in {"1", "true", "yes", "on"}


def env_list(name: str, default: str = "") -> list[str]:
    return [item.strip() for item in os.getenv(name, default).split(",") if item.strip()]


# ----------------------------------------------------------------------------
# Asosiy
# ----------------------------------------------------------------------------
# Xavfsiz default: o'rnatilmagan bo'lsa DEBUG=False (production himoyasi yoniq qoladi).
# Lokalda development uchun .env da DEBUG=True qo'ying (.env.example da bor).
DEBUG = env_bool("DEBUG", "False")

# SECRET_KEY .env dan keladi. Productionda (DEBUG=False) bo'lmasa — ishga tushmaydi.
SECRET_KEY = os.getenv("SECRET_KEY", "")
if not SECRET_KEY:
    if DEBUG:
        SECRET_KEY = "django-insecure-dev-only-do-not-use-in-production"
    else:
        raise ImproperlyConfigured(
            "SECRET_KEY muhit o'zgaruvchisi DEBUG=False bo'lganda majburiy. "
            ".env faylida SECRET_KEY ni o'rnating."
        )

ALLOWED_HOSTS = env_list(
    "ALLOWED_HOSTS",
    "ibrohimov-dev.uz,www.ibrohimov-dev.uz,localhost,127.0.0.1",
)

CSRF_TRUSTED_ORIGINS = env_list(
    "CSRF_TRUSTED_ORIGINS",
    "https://ibrohimov-dev.uz,https://www.ibrohimov-dev.uz",
)

# ----------------------------------------------------------------------------
# Telegram bot (aloqa formasi shu botga xabar yuboradi)
# ----------------------------------------------------------------------------
TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN", "")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID", "")

# ----------------------------------------------------------------------------
# Ilovalar
# ----------------------------------------------------------------------------
INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "portfolio",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    # WhiteNoise — statik fayllarni productionda gunicorn orqali tarqatadi
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# ----------------------------------------------------------------------------
# Ma'lumotlar bazasi — forma DB ga yozmaydi (Telegram ga forward),
# lekin Django uchun minimal SQLite saqlanadi.
# ----------------------------------------------------------------------------
# SQLite joyi env orqali sozlanadi. Docker'da volume bilan saqlanadi:
# SQLITE_PATH=/app/data/db.sqlite3 (docker-compose.yml da o'rnatilgan).
SQLITE_PATH = os.getenv("SQLITE_PATH", str(BASE_DIR / "db.sqlite3"))
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": SQLITE_PATH,
    }
}

# ----------------------------------------------------------------------------
# Til / vaqt (kontent i18n mijoz tomonida JS orqali boshqariladi)
# ----------------------------------------------------------------------------
LANGUAGE_CODE = "uz"
TIME_ZONE = "Asia/Tashkent"
USE_I18N = True
USE_TZ = True

# ----------------------------------------------------------------------------
# Statik fayllar (CSS, JS, rasm) — WhiteNoise
# ----------------------------------------------------------------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

# Development'da (runserver) oddiy storage — collectstatic shart emas.
# Production'da WhiteNoise siqilgan + manifest (kesh-busting) storage.
if DEBUG:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
    }
else:
    STORAGES = {
        "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
        "staticfiles": {"BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage"},
    }

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# ----------------------------------------------------------------------------
# Xavfsizlik (production, DEBUG=False bo'lganda kuchayadi)
# ----------------------------------------------------------------------------
if not DEBUG:
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SECURE_SSL_REDIRECT = env_bool("SECURE_SSL_REDIRECT", "True")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
