import { defaultLocale, type Locale } from "@/lib/i18n/config";

export type ContentFileKind = "site" | "work";

/** Repo-relative path for locale content JSON (forward slashes). */
export function contentRepoPath(kind: ContentFileKind, locale: Locale): string {
  return `content/${locale}/${kind}.json`;
}

export function legacySiteRepoPath(): string {
  return "content/site.json";
}

export function legacyWorkRepoPath(): string {
  return "content/work.json";
}

export function commitMessage(kind: ContentFileKind, locale: Locale): string {
  return `cms: update ${locale}/${kind}.json`;
}

export function resolveReadPaths(kind: ContentFileKind, locale: Locale): string[] {
  const paths = [contentRepoPath(kind, locale)];
  if (locale === defaultLocale) {
    paths.push(kind === "site" ? legacySiteRepoPath() : legacyWorkRepoPath());
  }
  return paths;
}
