import type { SiteContent, WorkContent } from "@/lib/content/types";

export const DEFAULT_SITE_CONTENT_RU: SiteContent = {
  site: {
    name: "OSON",
    shortName: "OSON",
    tagline: "Студия цифрового дизайна и разработки.",
    description:
      "Независимая студия: проектируем и создаём цифровые продукты для амбициозных команд.",
    url: "https://sitan.studio",
    ogImage: "/og.png",
    locale: "ru_RU",
    email: "studio@sitan.studio",
    location: "Удалённо — работаем по всему миру",
    founded: 2024,
    nav: [
      { label: "Главная", href: "/" },
      { label: "Работы", href: "/#work" },
      { label: "Услуги", href: "/#services" },
      { label: "Процесс", href: "/#process" },
    ],
    cta: {
      label: "Начать проект",
      href: "/#contact",
    },
    social: {
      twitter: "https://twitter.com/sitanstudio",
      github: "https://github.com/sitanstudio",
      dribbble: "https://dribbble.com/sitanstudio",
      linkedin: "https://linkedin.com/company/sitanstudio",
    },
    authors: [{ name: "OSON Studio", url: "https://sitan.studio" }],
    keywords: [
      "дизайн-студия",
      "веб-студия",
      "брендинг",
      "продуктовый дизайн",
      "разработка",
      "Next.js",
      "OSON",
    ],
  },
  sections: {
    hero: {
      eyebrow: "Независимая digital-студия",
      title: "Мы создаём продукты, которые",
      titleEmphasis: "запоминают.",
      description:
        "Проектируем и разрабатываем премиальные цифровые решения для брендов, стартапов и современного бизнеса.",
      primaryCta: { label: "Начать проект", href: "#contact" },
      secondaryCta: { label: "Смотреть работы", href: "#work" },
      scrollLabel: "Листайте",
    },
    work: {
      eyebrow: "Портфолио",
      heading: "Избранные проекты",
      intro:
        "Небольшая подборка недавних проектов — в каждом упор на ясность, производительность и продуктовый уровень. Качество важнее количества.",
    },
    services: {
      eyebrow: "Компетенции",
      heading: "Услуги",
      intro:
        "Полный цикл для команд, которым важны ощущения от продукта — от первого wireframe до запуска и итераций после.",
      items: [
        {
          title: "Веб-разработка",
          description:
            "Маркетинговые сайты и продуктовые интерфейсы на современном стеке — быстро, доступно и с запасом на рост.",
        },
        {
          title: "UI/UX дизайн",
          description:
            "Интерфейсы и дизайн-системы от исследования до финального UI без потери целостности.",
        },
        {
          title: "SaaS-разработка",
          description:
            "Дашборды, онбординг и биллинг для команд, которые выпускают B2B-продукты.",
        },
        {
          title: "Оптимизация производительности",
          description:
            "Core Web Vitals, размер бандла и инфраструктура — чтобы всё ощущалось мгновенным.",
        },
        {
          title: "Motion и интерактив",
          description:
            "Сдержанная анимация и микровзаимодействия, которые направляют внимание без лишнего шума.",
        },
      ],
    },
    process: {
      eyebrow: "Подход",
      heading: "Процесс",
      intro:
        "Понятная последовательность с местом для ремесла — короткие циклы обратной связи, без «чёрных ящиков».",
      steps: [
        {
          number: "01",
          title: "Исследование",
          description: "Продукт, цели и пользователи",
        },
        {
          number: "02",
          title: "Дизайн",
          description: "UI/UX и визуальное направление",
        },
        {
          number: "03",
          title: "Разработка",
          description: "Production-ready веб-приложение",
        },
        {
          number: "04",
          title: "Запуск",
          description: "Деплой, оптимизация и тестирование",
        },
        {
          number: "05",
          title: "Поддержка",
          description: "Улучшения и сопровождение",
        },
      ],
    },
    marquee: {
      items: [
        { label: "Студия", value: "OSON / Remote" },
        { label: "Фокус", value: "Бренд · Веб · Продукт" },
        { label: "Сроки", value: "От 4 недель" },
        { label: "Набор", value: "2026 — весенний intake" },
      ],
    },
    cta: {
      eyebrow: "Начнём диалог",
      heading: "Создадим что-то",
      headingEmphasis: "значимое.",
      description:
        "Работаем с основателями и командами, которым важно ремесло — от идеи до запуска и дальнейших итераций.",
      mailtoSubject: "Запрос на новый проект",
    },
  },
};

/** RU portfolio defaults — same slugs as EN; edit in admin per locale. */
export const DEFAULT_WORK_CONTENT_RU: WorkContent = {
  projects: [
    {
      slug: "atlas-metrics",
      title: "MotionDesign",
      category: "Продукт",
      year: "2077",
      description:
        "Метрики для SaaS: графики в реальном времени, аномалии и спокойный интерфейс для долгих сессий.",
      stack: ["Next.js", "TypeScript", "Tailwind"],
      accent: "hsl(220 42% 18%)",
      glow: "hsl(220 76% 58% / 0.35)",
      body:
        "Развёрнутые кейсы и метрики готовим для заинтересованных клиентов. Напишите, если нужна полная версия материала.",
    },
    {
      slug: "northwind-trade",
      title: "Northwind",
      category: "E-commerce",
      year: "2024",
      description:
        "Headless-витрина и дашборды для apparel-бренда при миграции с legacy-инфраструктуры.",
      stack: ["Shopify Hydrogen", "React", "Node"],
      accent: "hsl(263 38% 16%)",
      glow: "hsl(263 70% 50% / 0.28)",
      body:
        "Развёрнутые кейсы и метрики готовим для заинтересованных клиентов. Напишите, если нужна полная версия материала.",
    },
    {
      slug: "helios-studios",
      title: "Helios",
      category: "Редакция",
      year: "2024",
      description:
        "Портфолио и архив режиссёра — сдержанная типографика и ритм, построенный на изображении.",
      stack: ["Framer Motion", "MDX", "Vercel"],
      accent: "hsl(200 38% 14%)",
      glow: "hsl(199 88% 52% / 0.22)",
      body:
        "Развёрнутые кейсы и метрики готовим для заинтересованных клиентов. Напишите, если нужна полная версия материала.",
    },
    {
      slug: "circuit-ai",
      title: "Circuit",
      category: "Labs",
      year: "2026",
      description:
        "Среда для промптов, ревью и внедрения AI-воркфлоу в существующий ops-стек.",
      stack: ["React", "SSE", "OpenAI"],
      accent: "hsl(240 25% 12%)",
      glow: "hsl(280 65% 55% / 0.25)",
      body:
        "Развёрнутые кейсы и метрики готовим для заинтересованных клиентов. Напишите, если нужна полная версия материала.",
    },
  ],
};
