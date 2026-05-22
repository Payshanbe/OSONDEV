import Link from "next/link";

import { localeLabels, locales, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

export function AdminLocaleTabs({
  basePath,
  activeLocale,
}: {
  basePath: string;
  activeLocale: Locale;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2">
      <span className="mr-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        Language
      </span>
      {locales.map((loc) => (
        <Link
          key={loc}
          href={`${basePath}?locale=${loc}`}
          className={cn(
            "rounded-full border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
            activeLocale === loc
              ? "border-foreground/30 bg-foreground text-background"
              : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground",
          )}
        >
          {localeLabels[loc]}
        </Link>
      ))}
    </div>
  );
}
