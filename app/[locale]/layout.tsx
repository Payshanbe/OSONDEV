import { notFound } from "next/navigation";

import { SetHtmlLang } from "@/components/set-html-lang";
import { isValidLocale, type Locale } from "@/lib/i18n/config";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isValidLocale(locale)) notFound();

  return (
    <>
      <SetHtmlLang locale={locale as Locale} />
      {children}
    </>
  );
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "ru" }];
}
