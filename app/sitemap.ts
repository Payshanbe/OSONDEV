import type { MetadataRoute } from "next";

import { getSiteConfig, getWorkProjects } from "@/lib/content";
import { defaultLocale, locales } from "@/lib/i18n/config";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteConfig(defaultLocale).url.replace(/\/$/, "");
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    entries.push({
      url: `${baseUrl}/${locale}`,
      changeFrequency: "monthly",
      priority: 1,
    });

    const projects = await getWorkProjects(locale);
    for (const project of projects) {
      entries.push({
        url: `${baseUrl}/${locale}/work/${encodeURIComponent(project.slug)}`,
        changeFrequency: "monthly",
        priority: 0.8,
      });
    }
  }

  return entries;
}
