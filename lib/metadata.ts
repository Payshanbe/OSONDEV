import type { Metadata } from "next";

import { getSiteConfig } from "@/lib/content";
import { defaultLocale, locales, ogLocale, type Locale } from "@/lib/i18n/config";

interface BuildMetadataOptions {
  title?: string;
  description?: string;
  /** Path without locale prefix, e.g. `/` or `/work/foo` */
  path?: string;
  noIndex?: boolean;
  locale?: Locale;
}

function siteUrl(baseUrl: string, path: string): string {
  return new URL(path, `${baseUrl.replace(/\/$/, "")}/`).toString();
}

/**
 * Compose page-level metadata from a small set of overrides while keeping
 * sensible studio-wide defaults (titles, OG, robots, canonical, etc).
 */
export function buildMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
  locale = defaultLocale,
}: BuildMetadataOptions = {}): Metadata {
  const site = getSiteConfig(locale);
  const resolvedDescription = description ?? site.description;
  const pageTitle = title ? `${title} — ${site.name}` : `${site.name} — ${site.tagline}`;

  const localizedPath = path === "/" ? `/${locale}` : `/${locale}${path}`;
  const url = siteUrl(site.url, localizedPath);
  const openGraphImage = siteUrl(site.url, `/${locale}/opengraph-image`);
  const twitterImage = siteUrl(site.url, `/${locale}/twitter-image`);

  const languages: Record<string, string> = {};
  for (const loc of locales) {
    const altPath = path === "/" ? `/${loc}` : `/${loc}${path}`;
    languages[loc] = siteUrl(site.url, altPath);
  }

  return {
    metadataBase: new URL(site.url),
    // `absolute` prevents parent/layout title templates from appending site.name again.
    title: { absolute: pageTitle },
    description: resolvedDescription,
    keywords: [...site.keywords],
    authors: site.authors.map((a) => ({ name: a.name, url: a.url })),
    creator: site.name,
    publisher: site.name,
    alternates: {
      canonical: url,
      languages,
    },
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      url,
      siteName: site.name,
      title: pageTitle,
      description: resolvedDescription,
      images: [{ url: openGraphImage, width: 1200, height: 630, alt: pageTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: resolvedDescription,
      images: [twitterImage],
    },
    robots: noIndex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48" },
        { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: ["/favicon.ico"],
    },
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}
