import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_SITE_CONTENT, DEFAULT_WORK_CONTENT } from "@/lib/content/defaults";
import { DEFAULT_SITE_CONTENT_RU, DEFAULT_WORK_CONTENT_RU } from "@/lib/content/defaults-ru";
import type { SiteContent, WorkContent } from "@/lib/content/types";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";

const CONTENT_DIR = path.join(process.cwd(), "content");
const LEGACY_SITE_FILE = path.join(CONTENT_DIR, "site.json");
const LEGACY_WORK_FILE = path.join(CONTENT_DIR, "work.json");

function siteFile(locale: Locale) {
  return path.join(CONTENT_DIR, locale, "site.json");
}

function workFile(locale: Locale) {
  return path.join(CONTENT_DIR, locale, "work.json");
}

function defaultSiteFor(locale: Locale): SiteContent {
  return locale === "ru" ? DEFAULT_SITE_CONTENT_RU : DEFAULT_SITE_CONTENT;
}

function defaultWorkFor(locale: Locale): WorkContent {
  return locale === "ru" ? DEFAULT_WORK_CONTENT_RU : DEFAULT_WORK_CONTENT;
}

function mergeSiteContent(parsed: Partial<SiteContent>, locale: Locale): SiteContent {
  const base = defaultSiteFor(locale);
  return {
    site: { ...base.site, ...parsed.site },
    sections: {
      hero: { ...base.sections.hero, ...parsed.sections?.hero },
      work: { ...base.sections.work, ...parsed.sections?.work },
      services: {
        ...base.sections.services,
        ...parsed.sections?.services,
        items: parsed.sections?.services?.items ?? base.sections.services.items,
      },
      process: {
        ...base.sections.process,
        ...parsed.sections?.process,
        steps: parsed.sections?.process?.steps ?? base.sections.process.steps,
      },
      marquee: {
        items: parsed.sections?.marquee?.items ?? base.sections.marquee.items,
      },
      cta: { ...base.sections.cta, ...parsed.sections?.cta },
    },
  };
}

function mergeWorkContent(parsed: Partial<WorkContent>, locale: Locale): WorkContent {
  const base = defaultWorkFor(locale);
  return {
    projects: parsed.projects?.length ? parsed.projects : base.projects,
  };
}

function resolveLocale(locale?: string): Locale {
  return isValidLocale(locale) ? locale : defaultLocale;
}

async function readJsonFile(filePath: string): Promise<string | null> {
  try {
    return await readFile(filePath, "utf-8");
  } catch {
    return null;
  }
}

function readJsonFileSync(filePath: string): string | null {
  try {
    return readFileSync(filePath, "utf-8");
  } catch {
    return null;
  }
}

export async function readSiteContent(locale?: string): Promise<SiteContent> {
  const loc = resolveLocale(locale);
  const raw =
    (await readJsonFile(siteFile(loc))) ??
    (loc === defaultLocale ? await readJsonFile(LEGACY_SITE_FILE) : null);
  if (raw) return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>, loc);
  return defaultSiteFor(loc);
}

export async function readWorkContent(locale?: string): Promise<WorkContent> {
  const loc = resolveLocale(locale);
  const raw =
    (await readJsonFile(workFile(loc))) ??
    (loc === defaultLocale ? await readJsonFile(LEGACY_WORK_FILE) : null);
  if (raw) return mergeWorkContent(JSON.parse(raw) as Partial<WorkContent>, loc);
  return defaultWorkFor(loc);
}

export function readSiteContentSync(locale?: string): SiteContent {
  const loc = resolveLocale(locale);
  const raw =
    readJsonFileSync(siteFile(loc)) ??
    (loc === defaultLocale ? readJsonFileSync(LEGACY_SITE_FILE) : null);
  if (raw) return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>, loc);
  return defaultSiteFor(loc);
}

export function readWorkContentSync(locale?: string): WorkContent {
  const loc = resolveLocale(locale);
  const raw =
    readJsonFileSync(workFile(loc)) ??
    (loc === defaultLocale ? readJsonFileSync(LEGACY_WORK_FILE) : null);
  if (raw) return mergeWorkContent(JSON.parse(raw) as Partial<WorkContent>, loc);
  return defaultWorkFor(loc);
}

export async function writeSiteContent(content: SiteContent, locale: string): Promise<void> {
  const loc = resolveLocale(locale);
  const dir = path.join(CONTENT_DIR, loc);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(siteFile(loc), `${JSON.stringify(content, null, 2)}\n`, "utf-8");
}

export async function writeWorkContent(content: WorkContent, locale: string): Promise<void> {
  const loc = resolveLocale(locale);
  const dir = path.join(CONTENT_DIR, loc);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(workFile(loc), `${JSON.stringify(content, null, 2)}\n`, "utf-8");
}
