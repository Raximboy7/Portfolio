"""
AI yangiliklari: ochiq RSS/Atom manbalardan avtomatik yig'iladi (bepul, API kalitsiz).

- Dunyo: AI kompaniyalari va texnologiya nashrlarining AI bo'limlari.
- O'zbekiston: umumiy yangilik saytlari, faqat AI haqidagi xabarlar (kalit so'zlar bo'yicha).

Natija DATA_DIR/news.json ga yoziladi. Sahifa so'ralganda fayl TTL dan eski bo'lsa,
yangilash fon oqimida ishlaydi: foydalanuvchi hech qachon tashqi saytlarni kutmaydi.
Bir nechta gunicorn worker bir vaqtda yangilamasligi uchun fayl qulfi ishlatiladi.

Qo'lda yangilash: python manage.py yangiliklar
"""
import concurrent.futures
import email.utils
import fcntl
import gzip
import hashlib
import html
import json
import os
import re
import threading
import time
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from pathlib import Path

from django.conf import settings

FEEDS = [
    {"id": "openai", "name": "OpenAI", "url": "https://openai.com/news/rss.xml", "region": "world"},
    {"id": "google", "name": "Google AI", "url": "https://blog.google/innovation-and-ai/technology/ai/rss/", "region": "world"},
    {"id": "deepmind", "name": "Google DeepMind", "url": "https://deepmind.google/blog/rss.xml", "region": "world"},
    {"id": "verge", "name": "The Verge", "url": "https://www.theverge.com/rss/ai-artificial-intelligence/index.xml", "region": "world"},
    {"id": "techcrunch", "name": "TechCrunch", "url": "https://techcrunch.com/category/artificial-intelligence/feed/", "region": "world"},
    {"id": "mittr", "name": "MIT Technology Review", "url": "https://www.technologyreview.com/topic/artificial-intelligence/feed", "region": "world"},
    {"id": "ars", "name": "Ars Technica", "url": "https://arstechnica.com/ai/feed/", "region": "world"},
    {"id": "hf", "name": "Hugging Face", "url": "https://huggingface.co/blog/feed.xml", "region": "world"},
    {"id": "kun", "name": "Kun.uz", "url": "https://kun.uz/news/rss", "region": "uz", "ai_only": True},
    {"id": "daryo", "name": "Daryo", "url": "https://daryo.uz/rss/", "region": "uz", "ai_only": True},
    {"id": "gazeta", "name": "Gazeta.uz", "url": "https://www.gazeta.uz/oz/rss/", "region": "uz", "ai_only": True},
    {"id": "spot", "name": "Spot", "url": "https://www.spot.uz/oz/rss/", "region": "uz", "ai_only": True},
    {"id": "uza", "name": "UzA", "url": "https://uza.uz/oz/rss", "region": "uz", "ai_only": True},
]

TTL = 60 * 60                 # shu vaqtdan eski kesh fonda yangilanadi
PER_FEED = 15                 # har manbadan eng yangi N ta
KEEP_DAYS = {"world": 45, "uz": 180}
MAX_ITEMS = 400
MAX_BYTES = 4 * 1024 * 1024
TIMEOUT = 10
USER_AGENT = "Mozilla/5.0 (compatible; ibrohimov-dev.uz/1.0; +https://ibrohimov-dev.uz)"

# O'zbek manbalarida AI mavzusini ajratish (lotin, kirill, rus)
AI_RE = re.compile(
    r"sun[ʼ’'‘`]?iy\s+intellekt|сунъий\s+интеллект|искусственн\w*\s+интеллект|"
    r"(?-i:\bAI\b)|(?-i:\bИИ\b)|ChatGPT|OpenAI|Gemini|Claude|Anthropic|DeepSeek|Copilot|Grok|"
    r"neyro\s?tarmoq|нейросет|neyroset|\bLLM\b|chat-?bot|чат-?бот",
    re.I,
)
ATOM = "{http://www.w3.org/2005/Atom}"

_lock = threading.Lock()
_running = False
_mem = {"mtime": None, "data": None}


def data_dir():
    return Path(getattr(settings, "DATA_DIR", settings.BASE_DIR / "data"))


def cache_path():
    return data_dir() / "news.json"


# ----------------------------------------------------------------- parsing
def clean_text(value, limit=None):
    """HTML teglarini olib tashlaydi, bo'shliqlarni tekislaydi, uzun tireni almashtiradi."""
    text = re.sub(r"<[^>]+>", " ", value or "")
    text = html.unescape(html.unescape(text))
    text = re.sub(r"\s+", " ", text).strip()
    text = re.sub(r"\s*—\s*", ", ", text)  # saytda uzun tire ishlatilmaydi
    if limit and len(text) > limit:
        cut = text[:limit].rsplit(" ", 1)[0].rstrip(",.;:")
        text = cut + "…"
    return text


def parse_date(value):
    value = (value or "").strip()
    if not value:
        return None
    try:
        dt = email.utils.parsedate_to_datetime(value)
    except (TypeError, ValueError, IndexError):
        try:
            dt = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError:
            return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)


def _txt(el, tag):
    found = el.find(tag)
    return (found.text or "") if found is not None else ""


def parse_feed(raw, feed):
    """RSS 2.0 yoki Atom matnidan bir xil ko'rinishdagi yozuvlar ro'yxati."""
    raw = raw.lstrip(b"\xef\xbb\xbf \t\r\n")
    if b"<!ENTITY" in raw[:4096]:
        return []  # entity kengaytirish hujumlaridan himoya
    root = ET.fromstring(raw)
    entries = []
    for item in root.iter("item"):
        entries.append({
            "title": _txt(item, "title"),
            "link": _txt(item, "link").strip() or _txt(item, "guid").strip(),
            "summary": _txt(item, "description"),
            "date": _txt(item, "pubDate") or _txt(item, "{http://purl.org/dc/elements/1.1/}date"),
        })
    for entry in root.iter(ATOM + "entry"):
        link = ""
        for ln in entry.findall(ATOM + "link"):
            if ln.get("rel", "alternate") == "alternate" and ln.get("href"):
                link = ln.get("href")
                break
        entries.append({
            "title": _txt(entry, ATOM + "title"),
            "link": link.strip(),
            "summary": _txt(entry, ATOM + "summary") or _txt(entry, ATOM + "content"),
            "date": _txt(entry, ATOM + "published") or _txt(entry, ATOM + "updated"),
        })

    items = []
    for e in entries:
        title = clean_text(e["title"], 220)
        link = e["link"]
        if not title or not link.startswith(("http://", "https://")):
            continue
        summary = clean_text(e["summary"], 260)
        if feed.get("ai_only") and not AI_RE.search(title + " " + summary):
            continue
        published = parse_date(e["date"])
        if published is None:
            continue
        items.append({
            "id": hashlib.sha1(link.encode("utf-8")).hexdigest()[:16],
            "title": title,
            "summary": summary if summary.lower() != title.lower() else "",
            "link": link,
            "source": feed["name"],
            "source_id": feed["id"],
            "region": feed["region"],
            "published": published.isoformat(),
        })
    items.sort(key=lambda i: i["published"], reverse=True)
    return items[:PER_FEED]


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": USER_AGENT, "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as resp:
        raw = resp.read(MAX_BYTES)
    if raw[:2] == b"\x1f\x8b":  # ba'zi serverlar so'ralmasa ham gzip yuboradi
        raw = gzip.decompress(raw)[:MAX_BYTES]
    return raw


# ----------------------------------------------------------------- storage
def merge(old_items, new_items, now=None):
    """Yangi yozuvlarni qo'shadi, eskilarini KEEP_DAYS bo'yicha tozalaydi, sana bo'yicha tartiblaydi."""
    now = now or datetime.now(timezone.utc)
    by_id = {i["id"]: i for i in old_items}
    by_id.update({i["id"]: i for i in new_items})
    seen_titles, out = set(), []
    for item in sorted(by_id.values(), key=lambda i: i["published"], reverse=True):
        key = re.sub(r"\W+", "", item["title"].lower())[:80]
        if key in seen_titles:
            continue
        published = datetime.fromisoformat(item["published"])
        if published > now + timedelta(days=1):
            continue
        if now - published > timedelta(days=KEEP_DAYS.get(item["region"], 45)):
            continue
        seen_titles.add(key)
        out.append(item)
    return out[:MAX_ITEMS]


def load():
    """Keshdagi ma'lumot: {"updated": iso | None, "items": [...]} (fayl o'zgarmasa xotiradan)."""
    path = cache_path()
    try:
        mtime = path.stat().st_mtime
    except OSError:
        return {"updated": None, "items": []}
    if _mem["mtime"] != mtime:
        try:
            _mem["data"] = json.loads(path.read_text(encoding="utf-8"))
            _mem["mtime"] = mtime
        except (OSError, ValueError):
            return {"updated": None, "items": []}
    return _mem["data"]


def refresh():
    """Barcha manbalarni parallel o'qib keshni yangilaydi. Natija: (yangi_soni, xatolar)."""
    data_dir().mkdir(parents=True, exist_ok=True)
    lock_file = open(data_dir() / "news.lock", "w")
    try:
        try:
            fcntl.flock(lock_file, fcntl.LOCK_EX | fcntl.LOCK_NB)
        except BlockingIOError:
            return 0, {"lock": "boshqa jarayon yangilayapti"}
        errors, fresh = {}, []
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
            futures = {pool.submit(fetch, f["url"]): f for f in FEEDS}
            for fut in concurrent.futures.as_completed(futures):
                feed = futures[fut]
                try:
                    fresh.extend(parse_feed(fut.result(), feed))
                except Exception as exc:  # bitta manba xatosi qolganlariga xalaqit bermaydi
                    errors[feed["id"]] = f"{type(exc).__name__}: {exc}"[:200]
        old = load().get("items", [])
        known = {i["id"] for i in old}
        items = merge(old, fresh)
        payload = {
            "updated": datetime.now(timezone.utc).isoformat(),
            "items": items,
            "errors": errors,
        }
        tmp = cache_path().with_suffix(".tmp")
        tmp.write_text(json.dumps(payload, ensure_ascii=False), encoding="utf-8")
        os.replace(tmp, cache_path())
        return len([i for i in items if i["id"] not in known]), errors
    finally:
        lock_file.close()


def _refresh_bg():
    global _running
    try:
        refresh()
    except Exception:
        pass
    finally:
        with _lock:
            _running = False


def ensure_fresh():
    """Kesh eskirgan bo'lsa, fonda yangilashni boshlaydi (so'rovni kutdirmaydi)."""
    global _running
    try:
        age = time.time() - cache_path().stat().st_mtime
    except OSError:
        age = TTL + 1
    if age <= TTL:
        return
    with _lock:
        if _running:
            return
        _running = True
    threading.Thread(target=_refresh_bg, name="news-refresh", daemon=True).start()


def latest(limit=None, region=None):
    items = load().get("items", [])
    if region:
        items = [i for i in items if i["region"] == region]
    return items[:limit] if limit else items
