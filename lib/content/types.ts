export interface SocialLink {
  label: string;
  href: string;
}

/** Studio-wide settings (nav, SEO, contact). */
export interface SiteSettings {
  name: string;
  shortName: string;
  tagline: string;
  description: string;
  url: string;
  ogImage: string;
  locale: string;
  email: string;
  location: string;
  founded: number;
  nav: { label: string; href: string }[];
  cta: { label: string; href: string };
  social: SocialLink[];
  authors: { name: string; url: string }[];
  keywords: string[];
}

export interface HeroContent {
  eyebrow: string;
  title: string;
  titleEmphasis: string;
  description: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  scrollLabel: string;
}

export interface SectionIntro {
  eyebrow: string;
  heading: string;
  intro: string;
}

export interface ServiceItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface MarqueeItem {
  label: string;
  value: string;
}

export interface CtaContent {
  eyebrow: string;
  heading: string;
  headingEmphasis: string;
  description: string;
  mailtoSubject: string;
}

export interface SiteSections {
  hero: HeroContent;
  work: SectionIntro;
  services: SectionIntro & { items: ServiceItem[] };
  process: SectionIntro & { steps: ProcessStep[] };
  marquee: { items: MarqueeItem[] };
  cta: CtaContent;
}

export interface SiteContent {
  site: SiteSettings;
  sections: SiteSections;
}

export interface WorkMediaItem {
  url: string;
  type: "image" | "video";
}

export interface WorkProject {
  slug: string;
  title: string;
  category: string;
  year: string;
  description: string;
  stack: string[];
  accent: string;
  glow: string;
  /** Extended case copy for `/work/[slug]` */
  body?: string;
  /** Gallery — images and videos (Vercel Blob URLs) */
  gallery?: WorkMediaItem[];
  /** @deprecated Use gallery — kept for older JSON */
  coverImage?: string;
  /** @deprecated Use gallery */
  coverVideo?: string;
}

export interface WorkContent {
  projects: WorkProject[];
}

export type SiteConfig = SiteSettings;
