import type { SiteContent, WorkContent } from "@/lib/content/types";

export const DEFAULT_SITE_CONTENT: SiteContent = {
  site: {
    name: "OSONDEV",
    shortName: "STUDIO",
    tagline: "Digital studio",
    description:
      "OsonDev is an independent studio designing and engineering refined digital products for ambitious teams.",
    url: "https://osondev.tj",
    ogImage: "/en/opengraph-image",
    locale: "en_US",
    email: "info@osondev.tj",
    location: "Remote — operating worldwide",
    founded: 2024,
    nav: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/#work" },
      { label: "Services", href: "/#services" },
      { label: "Process", href: "/#process" },
    ],
    cta: {
      label: "Start a project",
      href: "/#contact",
    },
    social: [{ label: "Instagram", href: "https://www.instagram.com/osondev.tj" }],
    authors: [{ name: "OSON Dev", url: "https://osondev.tj" }],
    keywords: [
      "design studio",
      "web studio",
      "brand identity",
      "product design",
      "engineering",
      "Next.js studio",
      "OSONDEV",
    ],
  },
  sections: {
    hero: {
      eyebrow: "Independent design & development studio",
      title: "Complex ideas.",
      titleEmphasis: "Clear digital products.",
      description:
        "Strategy, product design, and engineering in one focused team — from the first system map to a production-ready release.",
      primaryCta: { label: "Start a project", href: "#contact" },
      secondaryCta: { label: "View work", href: "#work" },
      scrollLabel: "Scroll",
    },
    work: {
      eyebrow: "Portfolio",
      heading: "Selected work",
      intro:
        "A small set of recent engagements — each one pushed for clarity, performance, and a product-level finish. Detail over volume.",
    },
    services: {
      eyebrow: "Capabilities",
      heading: "Services",
      intro:
        "End-to-end craft for teams who care how things feel in hand — from first wireframe through launch and the iterations that follow.",
      items: [
        {
          title: "Web Development",
          description:
            "Marketing sites and product surfaces built on modern stacks — fast, accessible, and ready to scale.",
        },
        {
          title: "UI/UX Design",
          description:
            "Research-led interfaces and design systems that stay coherent from first sketch to shipped UI.",
        },
        {
          title: "SaaS Development",
          description:
            "Dashboards, onboarding, and billing flows engineered for teams shipping B2B software.",
        },
        {
          title: "Performance Optimization",
          description:
            "Core Web Vitals, bundle discipline, and infrastructure tuning so experiences feel instant.",
        },
        {
          title: "Motion & Interaction Design",
          description:
            "Restrained motion systems and micro-interactions that guide attention without spectacle.",
        },
      ],
    },
    process: {
      eyebrow: "Approach",
      heading: "Process",
      intro:
        "A clear sequence with room for craft — tight feedback loops, no black boxes, and decisions you can trace back to research.",
      steps: [
        {
          number: "01",
          title: "Discovery",
          description: "Understanding product, goals, and users",
        },
        {
          number: "02",
          title: "Design",
          description: "UI/UX design and visual direction",
        },
        {
          number: "03",
          title: "Development",
          description: "Building production-ready web application",
        },
        {
          number: "04",
          title: "Launch",
          description: "Deployment, optimization, and testing",
        },
        {
          number: "05",
          title: "Support",
          description: "Ongoing improvements and maintenance",
        },
      ],
    },
    marquee: {
      items: [
        { label: "Dev", value: "OSON / Remote" },
        { label: "Focus", value: "Brand · Web · Product" },
        { label: "Engagements", value: "From 4 weeks" },
        { label: "Cycle", value: "2026 — Spring intake" },
      ],
    },
    cta: {
      eyebrow: "Start a conversation",
      heading: "Let's build something",
      headingEmphasis: "meaningful.",
      description:
        "We partner with founders and teams who care about craft — from first concept through launch and the iterations that follow.",
      mailtoSubject: "New project inquiry",
    },
  },
};

export const DEFAULT_WORK_CONTENT: WorkContent = {
  projects: [
    {
      slug: "atlas-metrics",
      title: "Atlas",
      category: "Product",
      year: "2025",
      description:
        "A metrics layer for SaaS operators — realtime charts, anomalies, and a calm interface that survives long sessions.",
      stack: ["Next.js", "TypeScript", "Tailwind"],
      accent: "hsl(220 42% 18%)",
      glow: "hsl(220 76% 58% / 0.35)",
      body: "Extended case narratives, outcome metrics, and process notes are prepared for qualified conversations. Reach out below if you'd like this study in full — or browse the homepage grid while we finalize the archive.",
    },
    {
      slug: "northwind-trade",
      title: "Northwind",
      category: "Commerce",
      year: "2024",
      description:
        "Headless storefront and fulfilment dashboards for a midsize apparel brand migrating off legacy infra.",
      stack: ["Shopify Hydrogen", "React", "Node"],
      accent: "hsl(263 38% 16%)",
      glow: "hsl(263 70% 50% / 0.28)",
      body: "Extended case narratives, outcome metrics, and process notes are prepared for qualified conversations. Reach out below if you'd like this study in full — or browse the homepage grid while we finalize the archive.",
    },
    {
      slug: "helios-studios",
      title: "Helios",
      category: "Editorial",
      year: "2024",
      description:
        "Portfolio and archive for an independent filmmaker — restrained typography and image-led rhythm.",
      stack: ["Framer Motion", "MDX", "Vercel"],
      accent: "hsl(200 38% 14%)",
      glow: "hsl(199 88% 52% / 0.22)",
      body: "Extended case narratives, outcome metrics, and process notes are prepared for qualified conversations. Reach out below if you'd like this study in full — or browse the homepage grid while we finalize the archive.",
    },
    {
      slug: "circuit-ai",
      title: "Circuit",
      category: "Labs",
      year: "2026",
      description:
        "Workspace for prompting, reviewing, and shipping AI-assisted workflows inside an existing ops stack.",
      stack: ["React", "SSE", "OpenAI"],
      accent: "hsl(240 25% 12%)",
      glow: "hsl(280 65% 55% / 0.25)",
      body: "Extended case narratives, outcome metrics, and process notes are prepared for qualified conversations. Reach out below if you'd like this study in full — or browse the homepage grid while we finalize the archive.",
    },
  ],
};
