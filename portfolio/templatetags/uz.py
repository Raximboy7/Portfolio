"""O'zbekcha sana filtrlari (brauzer Intl'i o'zbek lokalini to'g'ri bermaydi, shuning uchun serverda)."""
from datetime import date, datetime, timezone
from zoneinfo import ZoneInfo

from django import template

register = template.Library()
TZ = ZoneInfo("Asia/Tashkent")
OYLAR = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"]


def _dt(value):
    if isinstance(value, str):
        try:
            value = datetime.fromisoformat(value)
        except ValueError:
            return None
    if isinstance(value, datetime):
        if value.tzinfo is None:
            value = value.replace(tzinfo=timezone.utc)
        return value.astimezone(TZ)
    return value


@register.filter
def uzdate(value):
    """2026-10-10 -> 10-oktabr, 2026"""
    d = _dt(value)
    if not isinstance(d, date):
        return ""
    return f"{d.day}-{OYLAR[d.month - 1]}, {d.year}"


@register.filter
def ago(value, now=None):
    """Nisbiy vaqt: hozirgina, 5 daqiqa oldin, 3 soat oldin, kecha, 4 kun oldin, 8-oktabr."""
    d = _dt(value)
    if not isinstance(d, datetime):
        return ""
    now = (now or datetime.now(timezone.utc)).astimezone(TZ)
    sec = (now - d).total_seconds()
    if sec < 90:
        return "hozirgina"
    if sec < 3600:
        return f"{int(sec // 60)} daqiqa oldin"
    days = (now.date() - d.date()).days
    if days == 0:
        return f"{int(sec // 3600)} soat oldin"
    if days == 1:
        return "kecha"
    if days < 7:
        return f"{days} kun oldin"
    if d.year == now.year:
        return f"{d.day}-{OYLAR[d.month - 1]}"
    return f"{d.day}-{OYLAR[d.month - 1]}, {d.year}"


@register.filter
def isodate(value):
    d = _dt(value)
    return d.isoformat() if isinstance(d, datetime) else ""
