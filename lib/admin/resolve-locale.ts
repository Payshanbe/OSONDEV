import { defaultLocale, isValidLocale, type Locale } from "@/lib/i18n/config";

export function resolveAdminLocale(
  value: string | undefined | null,
): Locale {
  return isValidLocale(value) ? value : defaultLocale;
}
