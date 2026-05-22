"use client";

import Link from "next/link";

import { cn } from "@/lib/utils";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { homePath, localizeHref } from "@/lib/i18n/paths";

interface LogoProps {
  className?: string;
  href?: string;
}

/**
 * Wordmark for the studio. A compact monogram mark sits next to the
 * gradient wordmark — both share the same baseline so the lockup
 * remains stable across breakpoints.
 */
export function Logo({ className, href = "/" }: LogoProps) {
  const { site } = useSiteContent();
  const locale = useLocale();
  const resolvedHref = href === "/" ? homePath(locale) : localizeHref(href, locale);

  return (
    <Link
      href={resolvedHref}
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex items-center gap-2.5 text-sm focus-ring rounded-full",
        className,
      )}
    >
      <span className="relative grid h-7 w-7 place-items-center overflow-hidden rounded-full border border-border/80 bg-background/50 backdrop-blur">
        <span
          aria-hidden
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "conic-gradient(from 220deg at 50% 50%, hsl(263 80% 60%), hsl(199 89% 55%), hsl(340 82% 60%), hsl(263 80% 60%))",
          }}
        />
        <span className="relative z-10 font-brand text-[11px] font-bold leading-none text-background mix-blend-screen">
          {site.shortName.charAt(0).toUpperCase()}
        </span>
      </span>
      <span className="text-foreground/95 transition-colors group-hover:text-foreground">
        <span className="font-brand text-[15px] font-bold tracking-tight sm:text-base">
          {site.name}
        </span>
        <span className="ml-1 font-sans text-muted-foreground/80 font-normal">/ studio</span>
      </span>
    </Link>
  );
}
