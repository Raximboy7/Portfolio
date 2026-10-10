"""AI yangiliklar keshini qo'lda (yoki cron orqali) yangilash: python manage.py yangiliklar"""
from django.core.management.base import BaseCommand

from portfolio import news


class Command(BaseCommand):
    help = "AI yangiliklarini RSS manbalardan yig'ib data/news.json ni yangilaydi"

    def handle(self, *args, **options):
        added, errors = news.refresh()
        total = len(news.latest())
        self.stdout.write(self.style.SUCCESS(f"Yangi: {added}, jami: {total}"))
        for feed_id, err in errors.items():
            self.stderr.write(f"  {feed_id}: {err}")
