# ============================================================================
#  ibrohimov-dev.uz — Django portfolio (gunicorn + whitenoise)
# ============================================================================
FROM python:3.13-slim

# Python sozlamalari
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    DJANGO_SETTINGS_MODULE=config.settings

WORKDIR /app

# Tizim bog'liqliklari (minimal)
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*

# Avval requirements — Docker layer kesh uchun
COPY requirements.txt .
RUN pip install --upgrade pip && pip install -r requirements.txt

# Loyiha kodi
COPY . .

# SQLite uchun saqlanadigan papka (docker-compose volume shu yerga ulanadi)
RUN mkdir -p /app/data

# Statik fayllarni yig'ish (whitenoise siqilgan+manifest storage, DEBUG=False bilan).
# Build paytida vaqtinchalik SECRET_KEY yetarli. Runtime'da qayta yig'ilmaydi.
RUN SECRET_KEY=build-time-dummy-key DEBUG=False python manage.py collectstatic --noinput

# Ishga tushirish
RUN chmod +x entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["./entrypoint.sh"]
