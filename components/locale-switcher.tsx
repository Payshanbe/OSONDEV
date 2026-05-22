"use client";

import { usePathname, useRouter } from "next/navigation";

import { useLocale } from "@/components/site-content-provider";
import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { replaceLocaleInPath } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

export function LocaleSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchTo = (next: Locale) => {
    if (next === locale) return;
    router.push(replaceLocaleInPath(pathname, next));
  };

  return (
    <div
      role="group"
      aria-label="Language"
      className={cn(
        "inline-flex items-center rounded-full border border-border/60 bg-background/40 p-0.5",
        className,
      )}
    >
      {locales.map((loc) => (
        <button
          key={loc}
          type="button"
          onClick={() => switchTo(loc)}
          aria-pressed={locale === loc}
          className={cn(
            "min-w-[2.25rem] rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
            locale === loc
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {localeLabels[loc]}
        </button>
      ))}
    </div>
  );
}
