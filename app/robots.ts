import type { MetadataRoute } from "next";

import { getSiteConfig } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  const site = getSiteConfig();
  const baseUrl = site.url.replace(/\/$/, "");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
