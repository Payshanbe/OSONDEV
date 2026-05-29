"use client";

import { createContext, useContext } from "react";

import type { SiteContent } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

type SiteContentContextValue = {
  content: SiteContent;
  locale: Locale;
};

const SiteContentContext = createContext<SiteContentContextValue | null>(null);

export function SiteContentProvider({
  content,
  locale,
  children,
}: {
  content: SiteContent;
  locale: Locale;
  children: React.ReactNode;
}) {
  return (
    <SiteContentContext.Provider value={{ content, locale }}>
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent(): SiteContent {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useSiteContent must be used within SiteContentProvider");
  }
  return ctx.content;
}

export function useLocale(): Locale {
  const ctx = useContext(SiteContentContext);
  if (!ctx) {
    throw new Error("useLocale must be used within SiteContentProvider");
  }
  return ctx.locale;
}
