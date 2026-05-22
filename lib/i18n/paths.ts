import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";

/** Strip leading locale segment from a pathname (`/en/work` → `/work`). */
export function stripLocaleFromPath(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length > 0 && isValidLocale(segments[0])) {
    const rest = segments.slice(1);
    return rest.length ? `/${rest.join("/")}` : "/";
  }
  return pathname || "/";
}

/** Replace or prepend locale in the current pathname. */
export function replaceLocaleInPath(pathname: string, locale: Locale): string {
  const rest = stripLocaleFromPath(pathname);
  if (rest === "/") return `/${locale}`;
  return `/${locale}${rest}`;
}

/**
 * Prefix internal links with the active locale.
 * Supports `#anchor`, `/#anchor`, `/`, `/work/foo`, `mailto:`, `https:`.
 */
export function localizeHref(href: string, locale: Locale): string {
  if (
    href.startsWith("http://") ||
    href.startsWith("https://") ||
    href.startsWith("mailto:")
  ) {
    return href;
  }

  if (href.startsWith("#")) {
    return `/${locale}${href}`;
  }

  if (href.startsWith("/#")) {
    return `/${locale}${href.slice(1)}`;
  }

  if (href === "/") {
    return `/${locale}`;
  }

  if (href.startsWith("/")) {
    const path = stripLocaleFromPath(href);
    if (path === "/") return `/${locale}`;
    return `/${locale}${path}`;
  }

  return `/${locale}/${href}`;
}

export function homePath(locale: Locale = defaultLocale): string {
  return `/${locale}`;
}

export function workPath(slug: string, locale: Locale = defaultLocale): string {
  return `/${locale}/work/${slug}`;
}
