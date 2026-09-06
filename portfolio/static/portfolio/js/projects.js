/* =============================================================================
   PROJECTS — loyihalar va mobil ilovalar (app.js #projGrid ga render qiladi).
   -----------------------------------------------------------------------------
   Yangi loyiha qo'shish: shu massivga obyekt qo'shing. desc da uz/ru/en bo'lsin.
   kind:    "web" (sayt) | "app" (mobil ilova)
   status:  "production" | "live" | "in-progress"
   logo:    index.html dagi PROJECT_LOGOS xaritasida key bo'yicha beriladi.
   ========================================================================== */

const PROJECTS = [
  // ------------------------------- Saytlar --------------------------------
  {
    key: "boss-school", kind: "web", name: "Boss School", url: "https://boss-school.uz",
    type: "EdTech · CRM/LMS", role: "Backend & Mobile Developer",
    stack: ["Django", "DRF", "PostgreSQL", "Flutter", "Docker"], platforms: ["Web", "Android", "iOS"],
    year: 2024, status: "production",
    desc: {
      uz: "Boss International School uchun to'liq platforma: o'quvchilar, to'lovlar, davomat, IELTS/LMS darslar, turniket va uchta mobil ilova.",
      ru: "Полная платформа для Boss International School: ученики, оплаты, посещаемость, IELTS/LMS-уроки, турникет и три мобильных приложения.",
      en: "Full platform for Boss International School: students, payments, attendance, IELTS/LMS lessons, turnstile and three mobile apps.",
    },
  },
  {
    key: "alaziz-academy", kind: "web", name: "Al Aziz Academy", url: "https://alazizacademy.uz",
    type: "Education · CRM", role: "Backend & Mobile Developer",
    stack: ["Django", "DRF", "PostgreSQL", "Flutter", "Celery"], platforms: ["Web", "Android", "iOS"],
    year: 2024, status: "production",
    desc: {
      uz: "O'quv markazi CRM: lidlar, guruhlar, dars jadvali, to'lovlar, hisobotlar, Telegram xabarnomalar va o'qituvchi ilovasi.",
      ru: "CRM учебного центра: лиды, группы, расписание, оплаты, отчёты, Telegram-уведомления и приложение для учителей.",
      en: "Learning-center CRM: leads, groups, schedule, payments, reports, Telegram notifications and a teacher app.",
    },
  },
  {
    key: "jibas", kind: "web", name: "JIBAS", url: "https://jibas.uz",
    type: "SaaS · CRM/LMS/ERP", role: "Founder & Backend Developer",
    stack: ["Django", "DRF", "PostgreSQL", "Celery", "Docker"], platforms: ["Web"],
    year: 2025, status: "production",
    desc: {
      uz: "Ta'lim va biznes uchun ko'p markazli SaaS platforma: CRM, LMS, ERP, mobil ilovalar va AI-analitika bitta tizimda.",
      ru: "Мультицентровая SaaS-платформа для образования и бизнеса: CRM, LMS, ERP, мобильные приложения и AI-аналитика.",
      en: "Multi-tenant SaaS for education and business: CRM, LMS, ERP, mobile apps and AI analytics in one system.",
    },
  },
  {
    key: "devnest", kind: "web", name: "DevNest", url: "https://devnest.uz",
    type: "PaaS · Hosting", role: "Founder & Backend Developer",
    stack: ["Django", "Docker", "Nginx", "PostgreSQL"], platforms: ["Web"],
    year: 2025, status: "production",
    desc: {
      uz: "Dasturchilar uchun PaaS: ZIP yoki Git orqali deploy, subdomen, SSL va konteynerlar — bir necha daqiqada jonli sayt.",
      ru: "PaaS для разработчиков: деплой через ZIP или Git, поддомены, SSL и контейнеры — живой сайт за несколько минут.",
      en: "PaaS for developers: deploy via ZIP or Git, subdomains, SSL and containers — a live site in minutes.",
    },
  },
  {
    key: "bozorlink", kind: "web", name: "Bozorlink", url: "https://bozorlink.uz",
    type: "POS · B2B Marketplace", role: "Backend & Frontend Developer",
    stack: ["Django", "DRF", "PostgreSQL", "JavaScript", "Docker"], platforms: ["Web", "PWA"],
    year: 2026, status: "production",
    desc: {
      uz: "Do'konlar uchun offline ishlaydigan kassa, ombor va mijozlar tizimi; ishlab chiqaruvchilar bilan B2B buyurtma va avto-kirim.",
      ru: "Офлайн-касса, склад и клиенты для магазинов; B2B-заказы у производителей с автоматическим приходом на склад.",
      en: "Offline-first POS, inventory and customers for stores; B2B ordering from producers with automatic restock.",
    },
  },
  {
    key: "nevio", kind: "web", name: "Nevio", url: "https://nevio.uz",
    type: "E-commerce", role: "Full-stack Developer",
    stack: ["Django", "JavaScript", "Telegram Bot"], platforms: ["Web"],
    year: 2025, status: "production",
    desc: {
      uz: "Avto parvarish mahsulotlari va atirlar onlayn do'koni: katalog, savat, buyurtma va Telegram orqali xabarnoma, uch tilda.",
      ru: "Интернет-магазин автокосметики и ароматов: каталог, корзина, заказы и уведомления в Telegram, три языка.",
      en: "Online store for car care products and fragrances: catalog, cart, orders and Telegram notifications, three languages.",
    },
  },
  {
    key: "sillage", kind: "web", name: "Sillage Parfyum", url: "https://sillage-parfyum.uz",
    type: "E-commerce", role: "Full-stack Developer",
    stack: ["Django", "PostgreSQL", "JavaScript"], platforms: ["Web"],
    year: 2025, status: "production",
    desc: {
      uz: "Original atirlar do'koni: katalog, brendlar, buyurtma holati, kun/tun rejimi va boshqaruv paneli.",
      ru: "Магазин оригинальной парфюмерии: каталог, бренды, статус заказа, тёмная тема и панель управления.",
      en: "Original perfume store: catalog, brands, order tracking, dark mode and an admin panel.",
    },
  },
  {
    key: "mirakbar", kind: "web", name: "ReadFlow", url: "https://mirakbar.uz",
    type: "Reading Platform · Blog", role: "Full-stack Developer",
    stack: ["Django", "Jazzmin", "Bootstrap"], platforms: ["Web"],
    year: 2025, status: "live",
    desc: {
      uz: "Ingliz tili va maqolalar uchun o'qish platformasi: bo'limlar, maqolalar, akkauntlar va admin panel.",
      ru: "Платформа для чтения статей и изучения английского: разделы, статьи, аккаунты и админ-панель.",
      en: "Reading platform for articles and English practice: sections, articles, accounts and an admin panel.",
    },
  },
  {
    key: "portfolio", kind: "web", name: "ibrohimov-dev.uz", url: "https://ibrohimov-dev.uz",
    type: "Personal Website", role: "Solo Developer",
    stack: ["Django", "JavaScript", "CSS", "Docker"], platforms: ["Web"],
    year: 2026, status: "live",
    desc: {
      uz: "Siz hozir ko'rib turgan portfolio sayti: Django, uch til (UZ/RU/EN), kun/tun rejimi, Docker bilan deploy.",
      ru: "Сайт-портфолио, который вы сейчас видите: Django, три языка (UZ/RU/EN), тёмная тема, деплой через Docker.",
      en: "The portfolio site you are looking at: Django, trilingual (UZ/RU/EN), dark mode, deployed with Docker.",
    },
  },

  // ---------------------------- Mobil ilovalar ----------------------------
  {
    key: "boss-student", kind: "app", name: "Boss School — Student", url: "",
    type: "Mobile App · IELTS/LMS", role: "Flutter Developer",
    stack: ["Flutter", "Dart", "REST API"], platforms: ["Android", "iOS"],
    year: 2025, status: "production",
    desc: {
      uz: "O'quvchilar uchun IELTS/LMS ilovasi: kitob darslari (Listening/Reading/Writing/Speaking), Mock imtihonlar, natijalar, sinf reytingi va AI yordamchi.",
      ru: "IELTS/LMS-приложение для учеников: уроки по книгам, Mock-экзамены, результаты, рейтинг класса и AI-помощник.",
      en: "IELTS/LMS app for students: book lessons, mock exams, results, class rating and an AI assistant.",
    },
  },
  {
    key: "boss-teacher", kind: "app", name: "Boss School — Teacher", url: "",
    type: "Mobile App · Teacher", role: "Flutter Developer",
    stack: ["Flutter", "Dart", "REST API"], platforms: ["Android", "iOS"],
    year: 2025, status: "production",
    desc: {
      uz: "O'qituvchilar uchun: sinflar, darslar, LMS topshiriqlarini tekshirish, natijalar va reyting — hammasi telefonda.",
      ru: "Для учителей: классы, уроки, проверка LMS-заданий, результаты и рейтинг — всё в телефоне.",
      en: "For teachers: classes, lessons, LMS assignment review, results and rating — all on the phone.",
    },
  },
  {
    key: "boss-parent", kind: "app", name: "Boss School — Parent", url: "",
    type: "Mobile App · Parent", role: "Flutter Developer",
    stack: ["Flutter", "Dart", "Push", "REST API"], platforms: ["Android", "iOS"],
    year: 2025, status: "production",
    desc: {
      uz: "Ota-onalar uchun: farzandning to'lovlari, dars jadvali, davomat, baholar, o'quv darajasi va turniket kirish/chiqish push-xabarnomalari.",
      ru: "Для родителей: оплаты, расписание, посещаемость, оценки, уровень обучения и push-уведомления о проходе через турникет.",
      en: "For parents: payments, schedule, attendance, grades, learning level and turnstile push notifications.",
    },
  },
  {
    key: "aziz-teacher", kind: "app", name: "Aziz Academy — Teacher", url: "",
    type: "Mobile App · Teacher", role: "Flutter Developer",
    stack: ["Flutter", "Dart", "REST API"], platforms: ["Android", "iOS"],
    year: 2024, status: "production",
    desc: {
      uz: "Al Aziz Academy o'qituvchilari uchun: guruhlar, o'quvchilar, dars jadvali, xabarlar va chat.",
      ru: "Для учителей Al Aziz Academy: группы, ученики, расписание, сообщения и чат.",
      en: "For Al Aziz Academy teachers: groups, students, schedule, messages and chat.",
    },
  },
  {
    key: "chat-app", kind: "app", name: "Real-time Chat", url: "",
    type: "Messaging", role: "Full-stack Developer",
    stack: ["Django Channels", "Redis", "WebSocket", "Flutter"], platforms: ["Web", "Mobile"],
    year: 2025, status: "in-progress",
    desc: {
      uz: "Real vaqtli chat: WebSocket orqali xabar almashish, Redis bilan onlayn holat. Ishlab chiqilmoqda.",
      ru: "Чат в реальном времени: обмен сообщениями через WebSocket, онлайн-статус через Redis. В разработке.",
      en: "Real-time chat: WebSocket messaging, online presence via Redis. In progress.",
    },
  },
];

window.PROJECTS = PROJECTS;
