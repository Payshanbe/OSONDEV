/**
 * @deprecated Import `getSiteConfig(locale)` from `@/lib/content` for server code,
 * or `useSiteContent()` in client components inside the marketing layout.
 */
import { getSiteConfig as getSiteConfigForLocale } from "@/lib/content";
import { defaultLocale } from "@/lib/i18n/config";

export type { SiteConfig } from "@/lib/content/types";

/** @deprecated Use `getSiteConfig(locale)` — reads from `content/{locale}/site.json`. */
export const siteConfig = getSiteConfigForLocale(defaultLocale);

export { getSiteConfigForLocale as getSiteConfig };
