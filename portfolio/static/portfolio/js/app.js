/* =============================================================================
   app.js — interaktivlik: i18n, tema, typing, scroll-reveal, projects,
   count-up, spotlight, tilt, burger, aloqa formasi.
   ========================================================================== */
(function () {
  "use strict";

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

  const LANGS = ["uz", "ru", "en"];
  const THEMES = ["dark", "light"];

  let lang  = localStorage.getItem("lang")  || "uz";
  let theme = localStorage.getItem("theme") || "dark";
  if (!LANGS.includes(lang)) lang = "uz";
  if (!THEMES.includes(theme)) theme = "dark";

  function t(key) {
    const d = window.I18N || {};
    return (d[lang] && d[lang][key]) || (d.en && d.en[key]) || key;
  }

  // ============================ I18N ======================================
  function applyLang(next) {
    if (next && LANGS.includes(next)) lang = next;
    localStorage.setItem("lang", lang);
    document.documentElement.setAttribute("lang", lang);

    $$("[data-i18n]").forEach(el => { el.textContent = t(el.getAttribute("data-i18n")); });
    $$("[data-i18n-ph]").forEach(el => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-ph"))); });
    $$(".lang-switch button").forEach(b => {
      const on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("active", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });

    renderProjects();
    startTyping();
  }

  // ============================ TEMA ======================================
  function applyTheme(next) {
    if (next && THEMES.includes(next)) theme = next;
    localStorage.setItem("theme", theme);
    document.documentElement.setAttribute("data-theme", theme);
    const meta = $('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "light" ? "#f4f4f5" : "#0a0a0b");
  }
  function toggleTheme() { applyTheme(theme === "dark" ? "light" : "dark"); }

  // ============================ TYPING ====================================
  let typeTimer = null;
  function startTyping() {
    clearTimeout(typeTimer);
    const el = $("#typed");
    if (!el) return;
    const roles = (window.I18N[lang] && window.I18N[lang]["hero.roles"]) || window.I18N.en["hero.roles"] || [];
    if (!roles.length) return;
    let ri = 0, ci = 0, del = false;
    (function step() {
      const w = roles[ri % roles.length] || "";
      if (!del) {
        el.textContent = w.slice(0, ++ci);
        if (ci >= w.length) { del = true; typeTimer = setTimeout(step, 1500); return; }
        typeTimer = setTimeout(step, 65 + Math.random() * 55);
      } else {
        el.textContent = w.slice(0, --ci);
        if (ci <= 0) { del = false; ri++; typeTimer = setTimeout(step, 280); return; }
        typeTimer = setTimeout(step, 32);
      }
    })();
  }

  // ============================ PROJECTS ==================================
  const ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17 17 7M8 7h9v9"/></svg>';

  function renderProjects() {
    const host = $("#projGrid");
    if (!host || !window.PROJECTS) return;
    host.innerHTML = window.PROJECTS.map((p, i) => {
      const desc = (p.desc && (p.desc[lang] || p.desc.en)) || "";
      const initials = p.name.split(/\s+/).map(w => w[0]).slice(0, 2).join("").toUpperCase();
      // Logo URL'lari shablonda {% static %} orqali beriladi (production xesh nomlari uchun).
      const logo = (window.PROJECT_LOGOS || {})[p.key];
      const icon = logo
        ? '<div class="proj-icon has-logo" aria-hidden="true"><img src="' + esc(logo) + '" alt="" loading="lazy"></div>'
        : '<div class="proj-icon" aria-hidden="true">' + esc(initials) + "</div>";
      const tags = p.stack.map(s => "<span>" + esc(s) + "</span>").join("");
      const link = p.url
        ? '<a class="proj-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(t("projects.visit")) + " " + ARROW + "</a>"
        : '<span class="proj-link disabled">' + esc(t("projects.soon")) + "</span>";
      const delay = "d" + ((i % 3) + 1);
      return (
        '<article class="proj glass reveal ' + delay + '">' +
          '<div class="proj-top">' +
            icon +
            '<span class="proj-status ' + esc(p.status) + '"><span class="sd"></span>' + esc(p.status) + "</span>" +
          "</div>" +
          "<h3>" + esc(p.name) + "</h3>" +
          '<div class="ptype">' + esc(p.type) + " · " + p.year + "</div>" +
          "<p>" + esc(desc) + "</p>" +
          '<div class="tags">' + tags + "</div>" +
          link +
        "</article>"
      );
    }).join("");

    observeReveals(host);
    bindProjGlow(host);
  }

  function bindProjGlow(host) {
    $$(".proj", host).forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--px", (e.clientX - r.left) + "px");
        card.style.setProperty("--py", (e.clientY - r.top) + "px");
      });
    });
  }

  // ============================ SCROLL-REVEAL =============================
  let revealIO = null;
  function observeReveals(scope) {
    if (!revealIO) {
      revealIO = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) { en.target.classList.add("visible"); revealIO.unobserve(en.target); }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    }
    $$(".reveal:not(.visible)", scope || document).forEach(el => revealIO.observe(el));
  }

  // ============================ COUNT-UP ==================================
  function countUp(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const dur = 1300, start = performance.now();
    (function frame(now) {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + "+";
      if (p < 1) requestAnimationFrame(frame);
    })(performance.now());
  }
  function initCounters() {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { countUp(en.target); io.unobserve(en.target); } });
    }, { threshold: 0.5 });
    $$("[data-count]").forEach(el => io.observe(el));
  }

  // ============================ SCROLL (nav, progress, spy) ===============
  function initScroll() {
    const nav = $("#nav");
    const progress = $("#progress");
    const links = $$(".nav-links a");
    // Faqat bir sahifa ichidagi langar havolalar (#id) scroll-spy'da qatnashadi —
    // aloqa sahifasidagi "/#about" kabi havolalar querySelector'ni buzmasligi uchun.
    const inPage = links.filter(a => (a.getAttribute("href") || "").startsWith("#"));
    const sections = inPage.map(a => $(a.getAttribute("href"))).filter(Boolean);
    let ticking = false;

    function update() {
      const y = window.scrollY;
      const h = document.documentElement.scrollHeight - window.innerHeight;
      if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
      if (nav) nav.classList.toggle("scrolled", y > 20);

      if (sections.length) {
        let active = sections[0];
        for (const s of sections) { if (s.getBoundingClientRect().top <= window.innerHeight * 0.35) active = s; }
        inPage.forEach(a => a.classList.toggle("active", active && a.getAttribute("href") === "#" + active.id));
      }
      ticking = false;
    }
    window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  // ============================ SPOTLIGHT + TILT =========================
  function initPointer() {
    const sp = $("#spotlight");
    if (sp && matchMedia("(pointer: fine)").matches) {
      window.addEventListener("pointermove", e => {
        sp.style.setProperty("--mx", e.clientX + "px");
        sp.style.setProperty("--my", e.clientY + "px");
      }, { passive: true });
    }
    // Eslatma: hero kartasi tilt/float OLIB TASHLANDI — hero qimirlamasligi uchun.
  }

  // ============================ MATRIX kod yomg'iri ======================
  function initMatrix() {
    const canvas = $("#matrix"), hero = $("#hero");
    if (!canvas || !hero) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const ctx = canvas.getContext("2d");
    const DIGITS = "0123456789".split("");
    const FS = 18;
    let W = 0, H = 0, cols = 0, drops = [];
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      canvas.style.width = W + "px"; canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(W / FS);
      // boshidanoq butun ekran bo'ylab tarqalgan bo'lsin (darrov ko'rinadi)
      drops = new Array(cols).fill(0).map(() => Math.floor(Math.random() * (H / FS)));
    }
    resize();
    window.addEventListener("resize", resize);
    let frame = 0;
    const STEP = 6;   // har 6-kadrda bir qator pastga (avvalgi tezlik)
    function loop() {
      // izlarni asta o'chirib boramiz (silliq, uzun quyruq)
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.04)";
      ctx.fillRect(0, 0, W, H);
      ctx.globalCompositeOperation = "source-over";
      if (frame++ % STEP === 0) {
        const light = document.documentElement.getAttribute("data-theme") === "light";
        ctx.fillStyle = light ? "rgba(10,10,11,0.85)" : "rgba(255,255,255,0.92)";
        ctx.font = FS + "px 'JetBrains Mono', monospace";
        for (let i = 0; i < cols; i++) {
          ctx.fillText(DIGITS[(Math.random() * DIGITS.length) | 0], i * FS, drops[i] * FS);
          if (drops[i] * FS > H && Math.random() > 0.95) drops[i] = 0;
          drops[i]++;   // bir qator pastga
        }
      }
      requestAnimationFrame(loop);
    }
    loop();
  }

  // ============================ BURGER (mobil) ===========================
  function initBurger() {
    const burger = $("#burger"), links = $("#navLinks");
    if (!burger || !links) return;
    burger.addEventListener("click", () => {
      const open = links.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    $$("#navLinks a").forEach(a => a.addEventListener("click", () => {
      links.classList.remove("open"); burger.setAttribute("aria-expanded", "false");
    }));
  }

  // ============================ ALOQA FORMASI ============================
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
    // To'g'ri raqammi? — ixtiyoriy ajratuvchilarni tashlab, 7–15 ta raqam bo'lsin.
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

  // ============================ MAGNIT TUGMALAR ==========================
  function initMagnetic() {
    if (!matchMedia("(pointer: fine)").matches) return;
    $$(".btn, .socials a, .icon-btn").forEach(el => {
      el.addEventListener("pointermove", e => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = "translate(" + (mx * 0.25) + "px," + (my * 0.4) + "px)";
      });
      el.addEventListener("pointerleave", () => { el.style.transform = ""; });
    });
  }

  // ============================ ISM: harf-harf reveal ====================
  function splitName() {
    const el = $(".hero .name");
    if (!el || el.dataset.split) return;
    el.dataset.split = "1";
    const words = el.textContent.trim().split(/\s+/);
    el.textContent = "";
    let i = 0;
    words.forEach((word, wi) => {
      // har bir so'z yaxlit (white-space:nowrap) — familiya o'rtasidan bo'linmaydi
      const w = document.createElement("span");
      w.className = "word";
      for (const ch of word) {
        const sp = document.createElement("span");
        sp.className = "ch"; sp.textContent = ch;
        sp.style.animationDelay = (0.2 + i * 0.045) + "s";
        w.appendChild(sp); i++;
      }
      el.appendChild(w);
      // so'zlar orasiga haqiqiy probel (faqat shu yerda qator uzilishi mumkin)
      if (wi < words.length - 1) { el.appendChild(document.createTextNode(" ")); i++; }
    });
  }

  // ============================ START ====================================
  document.addEventListener("DOMContentLoaded", () => {
    // deep-link: ?lang=ru&theme=light
    const q = new URLSearchParams(location.search);
    if (LANGS.includes(q.get("lang"))) lang = q.get("lang");
    if (THEMES.includes(q.get("theme"))) theme = q.get("theme");

    applyTheme(theme);
    applyLang(lang);          // renderProjects + startTyping ham chaqiradi
    splitName();
    initMatrix();
    observeReveals();
    initCounters();
    initScroll();
    initPointer();
    initMagnetic();
    initBurger();
    initContactForm();

    $$(".lang-switch button").forEach(b => b.addEventListener("click", () => applyLang(b.getAttribute("data-lang"))));
    const tt = $("#themeToggle"); if (tt) tt.addEventListener("click", toggleTheme);

    // Deep-link #hash: loyihalar JS bilan render bo'lgach pozitsiyani to'g'rilash
    if (location.hash && location.hash.length > 1) {
      const target = document.querySelector(location.hash);
      if (target) setTimeout(() => target.scrollIntoView({ block: "start" }), 60);
    }
  });

})();
