/* =============================================================================
   app.js: sayt interaktivligi ("raximboy-portfolio" shabloni asosida).
   i18n (UZ/RU/EN), kun/tun rejimi, mobil menyu, loyihalar (filtr + "barchasi"),
   yangiliklar filtri, nisbiy vaqt, kodni nusxalash, aloqa formasi.
   Yer shari: globe.js (faqat bosh sahifa).
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const LANGS = ["uz", "ru", "en"];
  const THEMES = ["dark", "light"];
  const store = {
    get: k => { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} },
  };

  let lang  = store.get("lang")  || "uz";
  let theme = store.get("theme") || "dark";
  if (!LANGS.includes(lang)) lang = "uz";
  if (!THEMES.includes(theme)) theme = "dark";

  function t(key) {
    const d = window.I18N || {};
    return (d[lang] && d[lang][key]) || (d.uz && d.uz[key]) || key;
  }
  window.siteT = t;   // globe.js yorliqlari uchun

  // ============================ I18N ======================================
  function applyLang(next) {
    if (next && LANGS.includes(next)) lang = next;
    store.set("lang", lang);
    document.documentElement.setAttribute("lang", lang);

    $$("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    $$("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria"))); });
    $$(".lang-switch button").forEach(b => {
      const on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    renderProjects();
    localizeTimes();
    updateTranslateLinks();
    $$(".copy-btn:not(.ok)").forEach(b => { b.textContent = t("guides.copy"); });
  }

  // ============================ TEMA ======================================
  function applyTheme(next) {
    if (next && THEMES.includes(next)) theme = next;
    store.set("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f5f5ee" : "#101311");
  }

  // ============================ MOBIL MENYU ===============================
  function initMenu() {
    const burger = $("#burger"), links = $("#navLinks");
    if (!burger || !links) return;
    const close = () => { links.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); };
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("a", links).forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  // ============================ LOYIHALAR =================================
  let projFilter = "all", projExpanded = false;
  function renderProjects() {
    const grid = $("#projectGrid");
    if (!grid) return;
    const all = typeof PROJECTS !== "undefined" ? PROJECTS : [];
    const assets = window.PROJECT_ASSETS || {};
    const ps = all.filter(p => projFilter === "all" || p.kind === projFilter);
    grid.innerHTML = (projExpanded ? ps : ps.slice(0, 4)).map(p => {
      const desc = (p.desc && (p.desc[lang] || p.desc.uz)) || "";
      const side = p.url
        ? `<a class="arrow" href="${esc(p.url)}" target="_blank" rel="noopener" aria-label="${esc(p.name)}: ${esc(t("projects.open_aria"))}">↗</a>`
        : `<span class="eyebrow">${p.status === "in-progress" ? esc(t("projects.in_progress")) : "ANDROID · IOS"}</span>`;
      const as = assets[p.key] || {}, type = esc((p.type || "").toUpperCase());
      const art = as.shot
        ? `<a class="project-art has-shot" href="${esc(p.url)}" target="_blank" rel="noopener" tabindex="-1" aria-hidden="true">` +
          `<img class="shot" src="${esc(as.shot)}" alt="" loading="lazy" decoding="async" width="960" height="600"><small>${type}</small></a>` +
          (as.logo ? `<span class="logo-chip"><img src="${esc(as.logo)}" alt="" loading="lazy" decoding="async" width="40" height="40"></span>` : "")
        : `<div class="project-art is-app">${as.logo ? `<img class="app-icon" src="${esc(as.logo)}" alt="" loading="lazy" decoding="async" width="76" height="76">` : ""}<small>${type}</small><strong>${esc(p.name)}</strong></div>`;
      return `<article class="project${as.shot ? " has-shot" : ""}">${art}` +
        `<div class="project-body"><div class="project-top"><h3>${esc(p.name)}</h3>${side}</div><p>${esc(desc)}</p>` +
        `<div class="tags">${(p.stack || []).map(s => `<span>${esc(s)}</span>`).join("")}</div></div></article>`;
    }).join("");
    const more = $("#more");
    if (more) more.hidden = projExpanded || ps.length <= 4;
  }
  function initProjects() {
    $$("[data-filter]").forEach(b => b.addEventListener("click", () => {
      projFilter = b.getAttribute("data-filter"); projExpanded = false;
      $$("[data-filter]").forEach(x => { const on = x === b; x.classList.toggle("active", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      renderProjects();
    }));
    const more = $("#more");
    if (more) more.addEventListener("click", () => { projExpanded = true; renderProjects(); });
  }

  // ============================ YANGILIKLAR ===============================
  function initNewsFilters() {
    const btns = $$("[data-news-filter]");
    if (!btns.length) return;
    const cards = $$("#newsList .news-card"), none = $("#newsNone");
    btns.forEach(b => b.addEventListener("click", () => {
      const f = b.getAttribute("data-news-filter");
      btns.forEach(x => { const on = x === b; x.classList.toggle("on", on); x.setAttribute("aria-pressed", on ? "true" : "false"); });
      let shown = 0;
      cards.forEach(c => { const hide = f !== "all" && c.getAttribute("data-region") !== f; c.hidden = hide; if (!hide) shown++; });
      if (none) none.hidden = shown > 0;
    }));
  }

  // Nisbiy vaqt joriy tilda (o'zbekcha qo'lda: brauzer Intl'i uz lokalini buzadi)
  const OYLAR = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  function agoText(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return null;
    const sec = (Date.now() - d.getTime()) / 1000;
    const day0 = x => new Date(x.getFullYear(), x.getMonth(), x.getDate()).getTime();
    const days = Math.round((day0(new Date()) - day0(d)) / 86400000);
    if (lang === "uz") {
      if (sec < 90) return "hozirgina";
      if (sec < 3600) return Math.floor(sec / 60) + " daqiqa oldin";
      if (days === 0) return Math.floor(sec / 3600) + " soat oldin";
      if (days === 1) return "kecha";
      if (days < 7) return days + " kun oldin";
      return d.getDate() + "-" + OYLAR[d.getMonth()] + (d.getFullYear() !== new Date().getFullYear() ? ", " + d.getFullYear() : "");
    }
    const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });
    if (sec < 3600) return rtf.format(-Math.max(1, Math.floor(sec / 60)), "minute");
    if (days === 0) return rtf.format(-Math.floor(sec / 3600), "hour");
    if (days < 7) return rtf.format(-days, "day");
    return d.toLocaleDateString(lang, { day: "numeric", month: "long" });
  }
  function localizeTimes() {
    $$("time[data-ago]").forEach(t => { const s = agoText(t.getAttribute("datetime")); if (s) t.textContent = s; });
  }
  function updateTranslateLinks() {
    $$(".nc-tr").forEach(a => {
      a.hidden = lang === "en";
      a.href = a.href.replace(/([?&]tl=)[a-z]+/, "$1" + lang);
    });
  }

  // ============================ MAQOLA: KODNI NUSXALASH ==================
  function initCopyButtons() {
    $$(".article pre").forEach(pre => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "copy-btn"; b.textContent = t("guides.copy");
      b.addEventListener("click", async () => {
        const code = pre.querySelector("code") || pre;
        try { await navigator.clipboard.writeText(code.innerText.replace(/\n$/, "")); b.textContent = t("guides.copied"); b.classList.add("ok"); }
        catch (e) { b.textContent = "Ctrl+C"; }
        setTimeout(() => { b.textContent = t("guides.copy"); b.classList.remove("ok"); }, 1800);
      });
      pre.classList.add("has-copy");
      pre.appendChild(b);
    });
  }

  // ============================ ALOQA FORMASI =============================
  function initContactForm() {
    const form = $("#contactForm");
    if (!form) return;
    const statusEl = $("#cf-status"), btn = $("#cf-send");
    const setStatus = (key, ok) => { statusEl.textContent = t(key); statusEl.className = "cf-status " + (ok ? "ok" : "err"); };

    // Muvaffaqiyat modali (kichik popup). Faqat aloqa sahifasida mavjud.
    const modal = $("#okModal");
    const openModal = () => {
      if (!modal) return;
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add("show"));
      const close = $("#okm-close"); if (close) close.focus();
    };
    const closeModal = () => {
      if (!modal) return;
      modal.classList.remove("show");
      setTimeout(() => { modal.hidden = true; }, 220);
    };
    if (modal) {
      $("#okm-close").addEventListener("click", closeModal);
      $("#okm-x").addEventListener("click", closeModal);
      modal.addEventListener("click", e => { if (e.target === modal) closeModal(); });
      document.addEventListener("keydown", e => { if (e.key === "Escape" && !modal.hidden) closeModal(); });
    }

    // Telefon: yozish paytida faqat ruxsat etilgan belgilar (raqam, bo'sh joy, + - ( ));
    // "+" faqat eng boshida turishi mumkin.
    const phoneEl = $("#cf-phone");
    if (phoneEl) {
      phoneEl.addEventListener("input", () => {
        let v = phoneEl.value.replace(/[^\d\s()+-]/g, "");        // taqiqlangan belgilarni olib tashlash
        v = v.replace(/(?!^)\+/g, "");                            // "+" faqat boshida
        if (phoneEl.value !== v) phoneEl.value = v;
      });
    }
    // To'g'ri raqammi? Ixtiyoriy ajratuvchilarni tashlab, 7–15 ta raqam bo'lsin.
    const phoneValid = (v) => { const d = v.replace(/[\s()+-]/g, ""); return /^\d{7,15}$/.test(d); };

    form.addEventListener("submit", async e => {
      e.preventDefault();
      const name = $("#cf-name").value.trim();
      const contact = $("#cf-contact").value.trim();
      const phone = $("#cf-phone").value.trim();
      const message = $("#cf-message").value.trim();
      const website = (form.querySelector('input[name="website"]') || {}).value || "";
      const token = (form.querySelector('input[name="csrfmiddlewaretoken"]') || {}).value || "";
      if (!name || !message) { setStatus("contact.form.missing", false); return; }
      if (phone && !phoneValid(phone)) { setStatus("contact.form.phone_invalid", false); phoneEl.focus(); return; }

      btn.disabled = true; statusEl.textContent = t("contact.form.sending"); statusEl.className = "cf-status";
      try {
        const resp = await fetch("/api/contact/", {
          method: "POST",
          headers: { "Content-Type": "application/json", "X-CSRFToken": token },
          body: JSON.stringify({ name, contact, phone, message, website }),
        });
        const data = await resp.json().catch(() => ({}));
        if (resp.ok && data.ok) {
          form.reset();
          if (modal) { statusEl.textContent = ""; statusEl.className = "cf-status"; openModal(); }
          else setStatus("contact.form.ok", true);
        }
        else if (resp.status === 429 || data.error === "rate_limited") setStatus("contact.form.rate", false);
        else if (resp.status === 503 || data.error === "not_configured") setStatus("contact.form.not_configured", false);
        else if (data.error === "bad_phone") setStatus("contact.form.phone_invalid", false);
        else setStatus("contact.form.err", false);
      } catch (_) { setStatus("contact.form.err", false); }
      finally { btn.disabled = false; }
    });
  }

  // ============================ START =====================================
  document.addEventListener("DOMContentLoaded", () => {
    // deep-link: ?lang=ru&theme=light
    const q = new URLSearchParams(location.search);
    if (LANGS.includes(q.get("lang"))) lang = q.get("lang");
    if (THEMES.includes(q.get("theme"))) theme = q.get("theme");

    applyTheme(theme);
    initProjects();
    initCopyButtons();
    applyLang(lang);          // loyihalar, vaqt va tarjima havolalari shu yerda chiziladi
    initMenu();
    initNewsFilters();
    initContactForm();

    $$(".lang-switch button").forEach(b => b.addEventListener("click", () => applyLang(b.getAttribute("data-lang"))));
    const tt = $("#themeToggle");
    if (tt) tt.addEventListener("click", () => applyTheme(theme === "dark" ? "light" : "dark"));
  });
})();
