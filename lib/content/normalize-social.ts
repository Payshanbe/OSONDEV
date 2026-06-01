import type { SocialLink } from "@/lib/content/types";

const LEGACY_SOCIAL_LABELS: Record<string, string> = {
  twitter: "Twitter",
  github: "GitHub",
  dribbble: "Dribbble",
  linkedin: "LinkedIn",
};

/** Accepts array links or legacy `{ twitter, github, ... }` objects from older JSON. */
export function normalizeSocialLinks(
  social: SocialLink[] | Record<string, string> | undefined,
  fallback: SocialLink[],
): SocialLink[] {
  if (!social) return fallback;

  if (Array.isArray(social)) {
    return social
      .map((item) => ({
        label: String(item.label ?? "").trim(),
        href: String(item.href ?? "").trim(),
      }))
      .filter((item) => item.label && item.href);
  }

  return Object.entries(social)
    .map(([key, href]) => ({
      label: LEGACY_SOCIAL_LABELS[key] ?? key,
      href: String(href ?? "").trim(),
    }))
    .filter((item) => item.href);
}
