"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { homePath, localizeHref } from "@/lib/i18n/paths";

interface LogoProps {
  className?: string;
  href?: string;
  /** Header uses `md`; footer uses `lg` with the full wordmark lockup */
  size?: "md" | "lg";
}

const logoConfig = {
  md: {
    src: "/logo-oson.png",
    width: 606,
    height: 322,
    className: "h-[1.8rem] w-auto",
  },
  lg: {
    src: "/logo-oson-wordmark.png",
    width: 612,
    height: 408,
    className: "h-[9rem] w-auto",
  },
} as const;

/** OSON brand — OD mark in nav, full wordmark in footer */
export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const { site } = useSiteContent();
  const locale = useLocale();
  const homeLabel = locale === "ru" ? "главная" : "home";
  const resolvedHref = href === "/" ? homePath(locale) : localizeHref(href, locale);
  const config = logoConfig[size];

  return (
    <Link
      href={resolvedHref}
      aria-label={`${site.name} — ${homeLabel}`}
      className={cn("focus-ring group inline-flex items-center rounded-md", className)}
    >
      <Image
        src={config.src}
        alt={`${site.name} dev`}
        width={config.width}
        height={config.height}
        className={cn(
          config.className,
          "opacity-90 transition-opacity duration-300 group-hover:opacity-100",
        )}
        priority={size === "md"}
      />
    </Link>
  );
}
