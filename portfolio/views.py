"""
View'lar:
  - index       : VS Code uslubidagi bitta sahifa
  - contact_api : aloqa formasi (POST) -> Telegram botga xabar yuboradi
"""
import json
import re
import urllib.error
import urllib.parse
import urllib.request

from django.conf import settings
from django.core.cache import cache
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_POST

# ============================================================================
# SITE — sayt meta ma'lumotlari va ijtimoiy havolalar.
# TODO: o'zingiznikiga moslang (havolalar shu yerdan boshqariladi).
# ============================================================================
SITE = {
    "name": "Raximboy Ibrohimov",
    "role": "Software Developer",
    "domain": "ibrohimov-dev.uz",
    "url": "https://ibrohimov-dev.uz",
    "email": "raximboy4200@gmail.com",
    "github": "https://github.com/Raximboy7",
    "github_user": "Raximboy7",
    "linkedin": "https://www.linkedin.com/in/raximboy-ibroximov-a75855268/",
    "portfolio": "https://raximboyibroximov.onrender.com/",
    "telegram": "https://t.me/Ibrohimov_uz_1996",
    "telegram_user": "@Ibrohimov_uz_1996",
    "instagram": "https://www.instagram.com/raximboy_ibrohimov/",
    "instagram_user": "@raximboy_ibrohimov",
}

MAX_LEN = {"name": 100, "contact": 150, "phone": 30, "message": 3000}

# Telefon: ixtiyoriy ajratuvchilarni (bo'sh joy, + - ( )) tashlab, 7–15 ta raqam bo'lishi shart (E.164).
_PHONE_RE = re.compile(r"^\d{7,15}$")


def _phone_ok(value: str) -> bool:
    """Bo'sh -> True (ixtiyoriy). Aks holda faqat to'g'ri xalqaro raqam qabul qilinadi."""
    if not value:
        return True
    digits = re.sub(r"[\s()+-]", "", value)
    return bool(_PHONE_RE.match(digits))

# Oddiy rate limiting (IP bo'yicha). LocMemCache ishlatiladi — har gunicorn worker'da
# alohida hisoblanadi; kuchliroq himoya uchun Redis cache ulang.
RATE_LIMIT = 5       # bitta IP uchun maksimal yuborishlar soni
RATE_WINDOW = 600    # vaqt oynasi (sekund) = 10 daqiqa


def _client_ip(request):
    xff = request.META.get("HTTP_X_FORWARDED_FOR", "")
    if xff:
        return xff.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR", "unknown")


@ensure_csrf_cookie
def index(request):
    """Bitta sahifali portfolio. ensure_csrf_cookie — forma uchun CSRF cookie o'rnatadi."""
    return render(request, "portfolio/index.html", {"site": SITE})


def robots_txt(request):
    """Qidiruv tizimlari uchun robots.txt — sitemap'ga yo'naltiradi."""
    lines = [
        "User-agent: *",
        "Allow: /",
        "Disallow: /api/",
        "",
        f"Sitemap: {SITE['url']}/sitemap.xml",
    ]
    return HttpResponse("\n".join(lines) + "\n", content_type="text/plain")


def sitemap_xml(request):
    """Bitta sahifali sayt uchun sitemap.xml."""
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        f'  <url>\n'
        f'    <loc>{SITE["url"]}/</loc>\n'
        f'    <changefreq>monthly</changefreq>\n'
        f'    <priority>1.0</priority>\n'
        f'  </url>\n'
        '</urlset>\n'
    )
    return HttpResponse(xml, content_type="application/xml")


@require_POST
def contact_api(request):
    """Aloqa formasini qabul qiladi va Telegram botga yuboradi."""
    # --- Ma'lumotni o'qish (JSON yoki form-data) ---
    try:
        if request.content_type and "application/json" in request.content_type:
            data = json.loads(request.body.decode("utf-8") or "{}")
        else:
            data = request.POST
    except (ValueError, UnicodeDecodeError):
        return JsonResponse({"ok": False, "error": "bad_request"}, status=400)

    # --- Honeypot (spam botlar shu yashirin maydonni to'ldiradi) ---
    if (data.get("website") or "").strip():
        # Botga muvaffaqiyat qaytaramiz, lekin hech narsa yubormaymiz.
        return JsonResponse({"ok": True})

    name = (data.get("name") or "").strip()[: MAX_LEN["name"]]
    contact = (data.get("contact") or "").strip()[: MAX_LEN["contact"]]
    phone = (data.get("phone") or "").strip()[: MAX_LEN["phone"]]
    message = (data.get("message") or "").strip()[: MAX_LEN["message"]]

    if not name or not message:
        return JsonResponse({"ok": False, "error": "missing_fields"}, status=422)

    if not _phone_ok(phone):
        return JsonResponse({"ok": False, "error": "bad_phone"}, status=422)

    # --- Rate limiting (IP bo'yicha) ---
    rl_key = "contact_rl_" + _client_ip(request)
    attempts = cache.get(rl_key, 0)
    if attempts >= RATE_LIMIT:
        return JsonResponse({"ok": False, "error": "rate_limited"}, status=429)
    cache.set(rl_key, attempts + 1, RATE_WINDOW)

    # --- Telegram sozlanganmi? ---
    token = settings.TELEGRAM_BOT_TOKEN
    chat_id = settings.TELEGRAM_CHAT_ID
    if not token or not chat_id:
        return JsonResponse({"ok": False, "error": "not_configured"}, status=503)

    text = (
        "🟢 <b>Yangi xabar — ibrohimov-dev.uz</b>\n\n"
        f"👤 <b>Ism:</b> {_esc(name)}\n"
        f"📨 <b>Aloqa:</b> {_esc(contact) or '—'}\n"
        f"📞 <b>Telefon:</b> {_esc(phone) or '—'}\n"
        f"💬 <b>Xabar:</b>\n{_esc(message)}"
    )

    if _send_telegram(token, chat_id, text):
        return JsonResponse({"ok": True})
    return JsonResponse({"ok": False, "error": "send_failed"}, status=502)


def _esc(value: str) -> str:
    """Telegram HTML parse_mode uchun minimal ekranlash."""
    return value.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def _send_telegram(token: str, chat_id: str, text: str) -> bool:
    """urllib (stdlib) orqali Telegram sendMessage API ga so'rov yuboradi."""
    url = f"https://api.telegram.org/bot{token}/sendMessage"
    payload = urllib.parse.urlencode(
        {
            "chat_id": chat_id,
            "text": text,
            "parse_mode": "HTML",
            "disable_web_page_preview": "true",
        }
    ).encode("utf-8")
    req = urllib.request.Request(url, data=payload, method="POST")
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            body = json.loads(resp.read().decode("utf-8"))
            return bool(body.get("ok"))
    except (urllib.error.URLError, ValueError, TimeoutError):
        return False
