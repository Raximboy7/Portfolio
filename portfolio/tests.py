"""Sayt testlari: python manage.py test portfolio"""
import json
import shutil
import tempfile
from datetime import datetime, timedelta, timezone
from pathlib import Path
from unittest import mock

from django.test import SimpleTestCase, override_settings
from django.urls import reverse

from portfolio import guides, news
from portfolio.templatetags.uz import ago, uzdate

RSS = b"""<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel><title>T</title>
<item><title>New model released &amp; benchmarks</title><link>https://example.com/a</link>
<description>&lt;p&gt;Big &lt;b&gt;update&lt;/b&gt; today&lt;/p&gt;</description><pubDate>Fri, 09 Oct 2026 10:00:00 GMT</pubDate></item>
<item><title>Bad link</title><link>javascript:alert(1)</link><pubDate>Fri, 09 Oct 2026 10:00:00 GMT</pubDate></item>
<item><title>No date</title><link>https://example.com/nodate</link></item>
</channel></rss>"""

ATOM = b"""<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom"><title>T</title>
<entry><title>Atom story</title><link rel="alternate" href="https://example.com/atom"/>
<summary>Short summary</summary><published>2026-10-09T08:30:00Z</published></entry>
</feed>"""

UZ_RSS = """<?xml version="1.0" encoding="utf-8"?>
<rss version="2.0"><channel>
<item><title>Sun’iy intellekt kelajakda ish haftasini qisqartiradi — Bezos</title><link>https://uz.example/1</link><pubDate>Fri, 09 Oct 2026 10:00:00 +0500</pubDate></item>
<item><title>Toshkentda yangi metro bekati ochildi</title><link>https://uz.example/2</link><pubDate>Fri, 09 Oct 2026 11:00:00 +0500</pubDate></item>
<item><title>ChatGPT o‘zbek tilini yaxshiroq tushunadi</title><link>https://uz.example/3</link><pubDate>Fri, 09 Oct 2026 12:00:00 +0500</pubDate></item>
</channel></rss>""".encode("utf-8")

WORLD = {"id": "w", "name": "World", "url": "https://w", "region": "world"}
UZ = {"id": "u", "name": "Uz", "url": "https://u", "region": "uz", "ai_only": True}


def item(i, days_ago=0, region="world", title=None):
    published = datetime.now(timezone.utc) - timedelta(days=days_ago, minutes=i)
    return {"id": f"id{i}", "title": title or f"Title {i}", "summary": "", "link": f"https://e/{i}",
            "source": "S", "source_id": "s", "region": region, "published": published.isoformat()}


class NewsParserTests(SimpleTestCase):
    def test_rss(self):
        items = news.parse_feed(RSS, WORLD)
        self.assertEqual(len(items), 1)  # yomon havola va sanasiz yozuv tashlanadi
        self.assertEqual(items[0]["title"], "New model released & benchmarks")
        self.assertEqual(items[0]["summary"], "Big update today")
        self.assertEqual(items[0]["region"], "world")

    def test_atom(self):
        items = news.parse_feed(ATOM, WORLD)
        self.assertEqual([i["link"] for i in items], ["https://example.com/atom"])
        self.assertTrue(items[0]["published"].startswith("2026-10-09T08:30"))

    def test_uz_feed_keeps_only_ai_and_drops_em_dash(self):
        items = news.parse_feed(UZ_RSS, UZ)
        self.assertEqual(len(items), 2)
        self.assertTrue(all("—" not in i["title"] for i in items))
        self.assertIn("Bezos", items[1]["title"])

    def test_entity_payload_rejected(self):
        evil = b'<?xml version="1.0"?><!DOCTYPE r [<!ENTITY a "aaaa">]><rss><channel></channel></rss>'
        self.assertEqual(news.parse_feed(evil, WORLD), [])

    def test_merge_dedupes_and_expires(self):
        old = [item(1), item(2, days_ago=60), item(3, days_ago=60, region="uz")]
        new = [item(4, title="Title 1")]  # bir xil sarlavha, boshqa id
        merged = news.merge(old, new)
        ids = [i["id"] for i in merged]
        self.assertNotIn("id2", ids)      # dunyo: 45 kundan eski
        self.assertIn("id3", ids)         # o'zbek: 180 kungacha saqlanadi
        self.assertEqual(sum(1 for i in merged if i["title"] == "Title 1"), 1)


class NewsStoreTests(SimpleTestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)
        self.override = override_settings(DATA_DIR=self.tmp)
        self.override.enable()
        self.addCleanup(self.override.disable)
        news._mem.update(mtime=None, data=None)

    def test_refresh_writes_cache_and_survives_feed_errors(self):
        def fake_fetch(url):
            if url == news.FEEDS[0]["url"]:
                return RSS
            raise OSError("down")
        with mock.patch.object(news, "fetch", side_effect=fake_fetch):
            added, errors = news.refresh()
        self.assertEqual(added, 1)
        self.assertEqual(len(errors), len(news.FEEDS) - 1)
        data = json.loads((self.tmp / "news.json").read_text(encoding="utf-8"))
        self.assertEqual(len(data["items"]), 1)
        self.assertEqual(news.latest()[0]["link"], "https://example.com/a")

    def test_ensure_fresh_runs_in_background_only_when_stale(self):
        with mock.patch.object(news.threading, "Thread") as thread:
            news.ensure_fresh()
            thread.assert_called_once()
        news._running = False
        (self.tmp / "news.json").write_text('{"items": []}', encoding="utf-8")
        with mock.patch.object(news.threading, "Thread") as thread:
            news.ensure_fresh()
            thread.assert_not_called()


class GuideTests(SimpleTestCase):
    def test_all_guides_loaded_in_order(self):
        items = guides.all_guides()
        self.assertEqual(len(items), 6)
        self.assertEqual(items[0].slug, "prompt-yozish")
        for g in items:
            self.assertTrue(g.title and g.summary and g.toc, g.slug)
            self.assertNotIn("—", g.title + g.summary + g.html, g.slug)

    def test_front_matter(self):
        meta, body = guides._front_matter("---\ntitle: A: B\norder: 3\n---\n# Body\n")
        self.assertEqual(meta, {"title": "A: B", "order": "3"})
        self.assertEqual(body, "# Body\n")

    def test_prev_next(self):
        prev, g, nxt = guides.get_guide("ai-agent")
        self.assertEqual((prev.slug, g.slug), ("prompt-yozish", "ai-agent"))
        self.assertIsNotNone(nxt)
        self.assertEqual(guides.get_guide("yoq"), (None, None, None))


class FilterTests(SimpleTestCase):
    def test_uzdate(self):
        self.assertEqual(uzdate(datetime(2026, 10, 10).date()), "10-oktabr, 2026")

    def test_ago(self):
        now = datetime(2026, 10, 10, 12, 0, tzinfo=timezone.utc)
        self.assertEqual(ago((now - timedelta(seconds=30)).isoformat(), now), "hozirgina")
        self.assertEqual(ago((now - timedelta(minutes=5)).isoformat(), now), "5 daqiqa oldin")
        self.assertEqual(ago((now - timedelta(hours=3)).isoformat(), now), "3 soat oldin")
        self.assertEqual(ago((now - timedelta(days=1)).isoformat(), now), "kecha")
        self.assertEqual(ago((now - timedelta(days=3)).isoformat(), now), "3 kun oldin")
        self.assertEqual(ago(datetime(2026, 9, 1, tzinfo=timezone.utc).isoformat(), now), "1-sentabr")


class PageTests(SimpleTestCase):
    def setUp(self):
        self.tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, self.tmp)
        items = [item(1, title="World AI story"), item(2, region="uz", title="Sun’iy intellekt haqida xabar")]
        (self.tmp / "news.json").write_text(json.dumps({"updated": items[0]["published"], "items": items}), encoding="utf-8")
        self.override = override_settings(DATA_DIR=self.tmp)
        self.override.enable()
        self.addCleanup(self.override.disable)
        news._mem.update(mtime=None, data=None)
        patcher = mock.patch.object(news, "ensure_fresh")
        patcher.start()
        self.addCleanup(patcher.stop)

    def get(self, name, *args):
        resp = self.client.get(reverse(name, args=args))
        self.assertEqual(resp.status_code, 200, name)
        return resp.content.decode("utf-8")

    def test_home(self):
        html = self.get("index")
        self.assertIn('id="earth"', html)                     # yer shari (hero)
        self.assertIn("portfolio/js/globe-points.js", html)
        self.assertIn('id="projectGrid"', html)
        self.assertIn('href="/taqdimot/"', html)              # AI bo'limidagi taqdimot kartasi
        self.assertIn('data-lang="ru"', html)                 # uch til saqlangan
        self.assertIn("World AI story", html)
        self.assertIn("Sun’iy intellekt haqida xabar", html)
        self.assertIn(reverse("guide", args=["prompt-yozish"]), html)

    def test_deck(self):
        resp = self.client.get(reverse("taqdimot"))
        self.assertEqual(resp.status_code, 200)
        self.assertEqual(resp["X-Frame-Options"], "SAMEORIGIN")
        html = resp.content.decode("utf-8")
        self.assertIn("<title>Sun’iy intellekt · taqdimot</title>", html)
        self.assertNotIn("__STATIC__", html)
        self.assertIn("html.m .slide", html)

    def test_guides_and_detail(self):
        html = self.get("guides")
        self.assertEqual(html.count('class="guide-card glass'), 6)
        html = self.get("guide", "n8n-telegram-bot")
        self.assertIn("npx n8n", html)
        self.assertIn('class="toc', html)
        self.assertEqual(self.client.get("/qollanmalar/mavjud-emas/").status_code, 404)

    def test_news_page(self):
        html = self.get("news")
        self.assertIn('data-region="uz"', html)
        self.assertIn('data-news-filter="uz"', html)
        self.assertIn("translate.google.com", html)

    def test_no_em_dash_on_pages(self):
        for name, args in [("index", ()), ("guides", ()), ("guide", ("prompt-yozish",)), ("news", ()), ("contact", ())]:
            html = self.get(name, *args)
            self.assertNotIn("—", html, name)

    def test_sitemap(self):
        xml = self.client.get("/sitemap.xml").content.decode()
        for path in ["/taqdimot/", "/qollanmalar/", "/qollanmalar/claude-skill/", "/yangiliklar/"]:
            self.assertIn(path, xml)
