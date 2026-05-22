"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { homePath, localizeHref } from "@/lib/i18n/paths";

interface LogoProps {
  className?: string;
  href?: string;
  /** Header uses `md`; footer can use `lg` for a larger lockup */
  size?: "md" | "lg";
}

const imageSizeClass = {
  md: "h-11 w-auto sm:h-12",
  lg: "h-[9rem] w-auto",
} as const;

/** OSON brand lockup — full wordmark image (white on dark UI) */
export function Logo({ className, href = "/", size = "md" }: LogoProps) {
  const { site } = useSiteContent();
  const locale = useLocale();
  const resolvedHref = href === "/" ? homePath(locale) : localizeHref(href, locale);

  return (
    <Link
      href={resolvedHref}
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex items-center focus-ring rounded-md",
        className,
      )}
    >
      <Image
        src="/logo-oson.png"
        alt={`${site.name} dev`}
        width={size === "lg" ? 360 : 240}
        height={size === "lg" ? 130 : 86}
        className={cn(
          imageSizeClass[size],
          "opacity-90 transition-opacity duration-300 group-hover:opacity-100",
        )}
        priority
      />
    </Link>
  );
}
