/* =============================================================================
   PROJECTS — loyihalar (projects.json tab + terminal 'projects' shu manbadan).
   -----------------------------------------------------------------------------
   Yangi loyiha qo'shish:  shu massivga obyekt qo'shing. desc da uz/ru/en bo'lsin.
   status:  "production" | "live" | "in-progress"
   ========================================================================== */

const PROJECTS = [
  {
    key: "boss-school",
    name: "Boss School",
    url: "https://boss-school.uz",
    type: "EdTech Platform",
    role: "Backend & Mobile Developer",
    stack: ["Django", "DRF", "PostgreSQL", "Flutter", "Docker"],
    platforms: ["Web", "Android", "iOS"],
    year: 2024,
    status: "production",
    desc: {
      uz: "Onlayn ta'lim platformasi: kurslar, video darslar, testlar, to'lovlar va o'quvchilar boshqaruvi. Backend va mobil ilovani ishlab chiqdim.",
      ru: "Образовательная онлайн-платформа: курсы, видеоуроки, тесты, платежи и управление учениками. Разработал бэкенд и мобильное приложение.",
      en: "Online learning platform: courses, video lessons, quizzes, payments and student management. Built the backend and the mobile app.",
    },
  },
  {
    key: "alaziz-academy",
    name: "Al Aziz Academy",
    url: "https://alazizacademy.uz",
    type: "Education / Academy",
    role: "Backend & Mobile Developer",
    stack: ["Django", "DRF", "PostgreSQL", "Flutter"],
    platforms: ["Web", "Android", "iOS"],
    year: 2024,
    status: "production",
    desc: {
      uz: "O'quv akademiyasi uchun veb-sayt va mobil ilova: kurslarga yozilish, dars jadvali va o'quvchi kabineti.",
      ru: "Сайт и мобильное приложение для учебной академии: запись на курсы, расписание занятий и личный кабинет.",
      en: "Website and mobile app for a learning academy: course enrollment, class schedule and a student dashboard.",
    },
  },
  {
    key: "jibas",
    name: "JIBAS",
    url: "https://jibas.uz",
    type: "Web Platform",
    role: "Backend Developer",
    stack: ["Django", "DRF", "PostgreSQL", "Docker"],
    platforms: ["Web"],
    year: 2024,
    status: "production",
    desc: {
      // TODO: tafsilotni o'zingizga moslang (loyiha tavsifi)
      uz: "jibas.uz uchun veb-platforma va boshqaruv tizimi — backend, API va ma'lumotlar bazasini ishlab chiqdim.",
      ru: "Веб-платформа и система управления для jibas.uz — разработал бэкенд, API и базу данных.",
      en: "Web platform and management system for jibas.uz — I built the backend, APIs and database.",
    },
  },
  {
    key: "chat-app",
    name: "Real-time Chat App",
    url: "",
    type: "Messaging",
    role: "Full-stack Developer",
    stack: ["Django Channels", "Redis", "WebSocket", "Flutter"],
    platforms: ["Web", "Mobile"],
    year: 2025,
    status: "in-progress",
    desc: {
      uz: "Real vaqtli chat ilovasi: WebSocket orqali xabar almashish, Redis bilan onlayn holat. Hozir ishlab chiqilmoqda.",
      ru: "Чат-приложение в реальном времени: обмен сообщениями через WebSocket, онлайн-статус через Redis. Сейчас в разработке.",
      en: "Real-time chat application: WebSocket messaging, online presence via Redis. Currently in progress.",
    },
  },
  {
    key: "portfolio",
    name: "Developer Portfolio",
    url: "https://ibrohimov-dev.uz",
    type: "Personal Website",
    role: "Solo Developer",
    stack: ["Django", "JavaScript", "CSS", "Docker"],
    platforms: ["Web"],
    year: 2026,
    status: "live",
    desc: {
      uz: "Siz hozir ko'rib turgan VS Code uslubidagi portfolio sayti. Django, uch tilli (UZ/RU/EN), Docker bilan deploy qilingan.",
      ru: "Сайт-портфолио в стиле VS Code, который вы сейчас видите. Django, три языка (UZ/RU/EN), деплой через Docker.",
      en: "The VS Code-style portfolio site you are looking at. Django, trilingual (UZ/RU/EN), deployed with Docker.",
    },
  },
];

window.PROJECTS = PROJECTS;
