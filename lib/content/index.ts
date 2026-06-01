import {
  readSiteContent,
  readSiteContentSync,
  readWorkContent,
  readWorkContentSync,
} from "@/lib/content/storage";
import type { SiteContent, SiteSettings, WorkProject } from "@/lib/content/types";
import { defaultLocale, type Locale } from "@/lib/i18n/config";

export type {
  SiteContent,
  SiteSettings,
  SocialLink,
  SiteConfig,
  SiteSections,
  HeroContent,
  SectionIntro,
  ServiceItem,
  ProcessStep,
  MarqueeItem,
  CtaContent,
  WorkProject,
  WorkContent,
} from "@/lib/content/types";

export { DEFAULT_SITE_CONTENT, DEFAULT_WORK_CONTENT } from "@/lib/content/defaults";
export { DEFAULT_SITE_CONTENT_RU, DEFAULT_WORK_CONTENT_RU } from "@/lib/content/defaults-ru";

export async function getSiteContent(locale: Locale = defaultLocale): Promise<SiteContent> {
  return readSiteContent(locale);
}

export function getSiteConfig(locale: Locale = defaultLocale): SiteSettings {
  return readSiteContentSync(locale).site;
}

export async function getWorkProjects(locale: Locale = defaultLocale): Promise<WorkProject[]> {
  const { projects } = await readWorkContent(locale);
  return projects;
}

export function getWorkProjectsSync(locale: Locale = defaultLocale): WorkProject[] {
  return readWorkContentSync(locale).projects;
}

export async function getWorkProject(
  slug: string,
  locale: Locale = defaultLocale,
): Promise<WorkProject | undefined> {
  const projects = await getWorkProjects(locale);
  return projects.find((p) => p.slug === slug);
}

export function getWorkProjectSync(
  slug: string,
  locale: Locale = defaultLocale,
): WorkProject | undefined {
  return getWorkProjectsSync(locale).find((p) => p.slug === slug);
}
