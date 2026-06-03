#!/bin/sh
set -e

# Ma'lumotlar bazasi migratsiyalari (SQLite — Django ichki jadvallar uchun)
python manage.py migrate --noinput

# Eslatma: collectstatic build bosqichida (Dockerfile, DEBUG=False) bajarilgan,
# shuning uchun bu yerda qayta yig'ilmaydi (manifest storage buzilmasligi uchun).

# Production WSGI server
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers ${GUNICORN_WORKERS:-3} \
    --timeout 60 \
    --access-logfile - \
    --error-logfile -
