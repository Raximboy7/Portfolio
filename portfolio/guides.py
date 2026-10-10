"""
AI qo'llanmalar: portfolio/guides/*.md fayllaridan o'qiladi (baza kerak emas).

Fayl tuzilishi (slug = fayl nomi = URL qismi, faqat a-z, 0-9 va "-"):

    ---
    title: Sarlavha
    summary: Kartada chiqadigan qisqa tavsif
    icon: prompt          # ICONS kalitlaridan biri (templates/portfolio/_icon.html)
    slide: 14             # taqdimotdagi tegishli slayd raqami (ixtiyoriy)
    order: 1              # ro'yxatdagi tartib
    updated: 2026-10-10
    ---
    Markdown matn...

Yangi qo'llanma qo'shish: shu papkaga `slug.md` fayl qo'ying va saytni qayta ishga tushiring.
"""
import datetime
import re
from dataclasses import dataclass, field
from pathlib import Path

import markdown

GUIDES_DIR = Path(__file__).resolve().parent / "guides"
SLUG_RE = re.compile(r"^[a-z0-9-]+$")
WORDS_PER_MINUTE = 170

_cache = {"sig": None, "items": []}


@dataclass(frozen=True)
class Guide:
    slug: str
    title: str
    summary: str
    icon: str
    order: int
    html: str
    minutes: int
    slide: int | None = None
    updated: datetime.date | None = None
    toc: list = field(default_factory=list)


def _front_matter(text):
    """'---' bilan o'ralgan "kalit: qiymat" qatorlarini va qolgan matnni qaytaradi."""
    meta = {}
    if text.startswith("---"):
        head, sep, body = text[3:].partition("\n---")
        if sep:
            for line in head.strip().splitlines():
                key, colon, value = line.partition(":")
                if colon and key.strip():
                    meta[key.strip()] = value.strip()
            return meta, body.lstrip("\n")
    return meta, text


def _int(value, default=None):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _load(path):
    meta, body = _front_matter(path.read_text(encoding="utf-8"))
    md = markdown.Markdown(
        extensions=["fenced_code", "tables", "sane_lists", "toc"],
        extension_configs={"toc": {"toc_depth": "2-2"}},
    )
    html = md.convert(body)
    # Jadvallar telefonda gorizontal suriladi (sahifa emas)
    html = html.replace("<table>", '<div class="table-wrap"><table>').replace("</table>", "</table></div>")
    try:
        updated = datetime.date.fromisoformat(meta.get("updated", ""))
    except ValueError:
        updated = None
    words = len(re.findall(r"\w+", body))
    return Guide(
        slug=path.stem,
        title=meta.get("title", path.stem),
        summary=meta.get("summary", ""),
        icon=meta.get("icon", "book"),
        order=_int(meta.get("order"), 100),
        slide=_int(meta.get("slide")),
        updated=updated,
        html=html,
        minutes=max(2, round(words / WORDS_PER_MINUTE)),
        toc=[(t["id"], t["name"]) for t in md.toc_tokens],
    )


def all_guides():
    """Tartiblangan qo'llanmalar ro'yxati. Fayllar o'zgarsa qayta o'qiladi."""
    paths = [p for p in GUIDES_DIR.glob("*.md") if SLUG_RE.match(p.stem)]
    sig = tuple(sorted((p.name, p.stat().st_mtime_ns) for p in paths))
    if sig != _cache["sig"]:
        _cache["items"] = sorted((_load(p) for p in paths), key=lambda g: (g.order, g.slug))
        _cache["sig"] = sig
    return _cache["items"]


def get_guide(slug):
    """(oldingi, qo'llanma, keyingi) yoki topilmasa (None, None, None)."""
    items = all_guides()
    for i, g in enumerate(items):
        if g.slug == slug:
            prev = items[i - 1] if i > 0 else None
            nxt = items[i + 1] if i + 1 < len(items) else None
            return prev, g, nxt
    return None, None, None
