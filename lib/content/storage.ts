import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

import { DEFAULT_SITE_CONTENT, DEFAULT_WORK_CONTENT } from "@/lib/content/defaults";
import { DEFAULT_SITE_CONTENT_RU, DEFAULT_WORK_CONTENT_RU } from "@/lib/content/defaults-ru";
import { normalizeWorkProject } from "@/lib/content/normalize-work-project";
import type { SiteContent, SocialLink, WorkContent, WorkProject } from "@/lib/content/types";
import { normalizeSocialLinks } from "@/lib/content/normalize-social";
import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";
import { isGitHubStorageEnabled, readGitHubFile, writeGitHubFile } from "@/lib/content/github";
import {
  commitMessage,
  contentRepoPath,
  resolveReadPaths,
  type ContentFileKind,
} from "@/lib/content/paths";

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
  const mergedSite = { ...base.site, ...parsed.site };
  return {
    site: {
      ...mergedSite,
      social: normalizeSocialLinks(
        parsed.site?.social as SocialLink[] | Record<string, string> | undefined,
        base.site.social,
      ),
    },
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

function normalizeWorkProjects(projects: WorkProject[]): WorkProject[] {
  return projects.map(normalizeWorkProject);
}

function mergeWorkContent(parsed: Partial<WorkContent>, locale: Locale): WorkContent {
  const base = defaultWorkFor(locale);
  return {
    projects: parsed.projects?.length
      ? normalizeWorkProjects(parsed.projects)
      : base.projects,
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

async function readRawContent(kind: ContentFileKind, locale: Locale): Promise<string | null> {
  if (isGitHubStorageEnabled()) {
    for (const repoPath of resolveReadPaths(kind, locale)) {
      const raw = await readGitHubFile(repoPath);
      if (raw) return raw;
    }
    return null;
  }

  const localPath = kind === "site" ? siteFile(locale) : workFile(locale);
  const legacyPath = kind === "site" ? LEGACY_SITE_FILE : LEGACY_WORK_FILE;
  return (
    (await readJsonFile(localPath)) ?? (locale === defaultLocale ? await readJsonFile(legacyPath) : null)
  );
}

function readRawContentSync(kind: ContentFileKind, locale: Locale): string | null {
  const localPath = kind === "site" ? siteFile(locale) : workFile(locale);
  const legacyPath = kind === "site" ? LEGACY_SITE_FILE : LEGACY_WORK_FILE;
  return (
    readJsonFileSync(localPath) ?? (locale === defaultLocale ? readJsonFileSync(legacyPath) : null)
  );
}

export async function readSiteContent(locale?: string): Promise<SiteContent> {
  const loc = resolveLocale(locale);
  const raw = await readRawContent("site", loc);
  if (raw) return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>, loc);
  return defaultSiteFor(loc);
}

export async function readWorkContent(locale?: string): Promise<WorkContent> {
  const loc = resolveLocale(locale);
  const raw = await readRawContent("work", loc);
  if (raw) return mergeWorkContent(JSON.parse(raw) as Partial<WorkContent>, loc);
  return defaultWorkFor(loc);
}

export function readSiteContentSync(locale?: string): SiteContent {
  const loc = resolveLocale(locale);
  const raw = readRawContentSync("site", loc);
  if (raw) return mergeSiteContent(JSON.parse(raw) as Partial<SiteContent>, loc);
  return defaultSiteFor(loc);
}

export function readWorkContentSync(locale?: string): WorkContent {
  const loc = resolveLocale(locale);
  const raw = readRawContentSync("work", loc);
  if (raw) return mergeWorkContent(JSON.parse(raw) as Partial<WorkContent>, loc);
  return defaultWorkFor(loc);
}

async function writeRawContent(
  kind: ContentFileKind,
  locale: Locale,
  json: string,
): Promise<void> {
  if (isGitHubStorageEnabled()) {
    const repoPath = contentRepoPath(kind, locale);
    await writeGitHubFile(repoPath, json, commitMessage(kind, locale));
    return;
  }

  const filePath = kind === "site" ? siteFile(locale) : workFile(locale);
  const dir = path.join(CONTENT_DIR, locale);
  if (!existsSync(dir)) await mkdir(dir, { recursive: true });
  await writeFile(filePath, json, "utf-8");
}

export async function writeSiteContent(content: SiteContent, locale: string): Promise<void> {
  const loc = resolveLocale(locale);
  const json = `${JSON.stringify(content, null, 2)}\n`;
  await writeRawContent("site", loc, json);
}

export async function writeWorkContent(content: WorkContent, locale: string): Promise<void> {
  const loc = resolveLocale(locale);
  const json = `${JSON.stringify(content, null, 2)}\n`;
  await writeRawContent("work", loc, json);
}

export { isGitHubStorageEnabled } from "@/lib/content/github";
