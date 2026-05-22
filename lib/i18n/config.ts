export const locales = ["en", "ru"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeCookieName = "sitan_locale";

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ru: "RU",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  ru: "Русский",
};

export const htmlLang: Record<Locale, string> = {
  en: "en",
  ru: "ru",
};

export const ogLocale: Record<Locale, string> = {
  en: "en_US",
  ru: "ru_RU",
};

export function isValidLocale(value: string | undefined | null): value is Locale {
  return locales.includes(value as Locale);
}
