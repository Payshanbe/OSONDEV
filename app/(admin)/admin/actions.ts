"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import {
  createSessionToken,
  getAdminCookieMaxAge,
  getAdminCookieName,
  verifyAdminPassword,
  verifySessionToken,
  isAdminPasswordConfigured,
} from "@/lib/auth/session";
import type { SiteSettings, SiteSections, WorkProject } from "@/lib/content/types";
import {
  isGitHubStorageEnabled,
  readSiteContent,
  readWorkContent,
  writeSiteContent,
  writeWorkContent,
} from "@/lib/content/storage";
import { defaultLocale, isValidLocale, locales, type Locale } from "@/lib/i18n/config";

export type ActionState = { ok: boolean; message: string };

/** Login form state — `redirectTo` set after a successful sign-in. */
export type LoginState = ActionState & { redirectTo?: string };

const FAIL = (message: string): ActionState => ({ ok: false, message });

function saveOk(): ActionState {
  if (isGitHubStorageEnabled()) {
    return {
      ok: true,
      message:
        "Saved to GitHub. The live site updates after Vercel finishes deploying (about 1–2 minutes).",
    };
  }
  return { ok: true, message: "Saved." };
}

async function requireAdmin() {
  const token = (await cookies()).get(getAdminCookieName())?.value;
  if (!verifySessionToken(token)) {
    throw new Error("Unauthorized");
  }
}

function parseLocale(formData: FormData): Locale {
  const raw = String(formData.get("locale") ?? defaultLocale);
  return isValidLocale(raw) ? raw : defaultLocale;
}

function revalidateMarketing() {
  for (const locale of locales) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}`, "layout");
  }
}

function revalidateWorkSlug(slug: string) {
  for (const locale of locales) {
    revalidatePath(`/${locale}/work/${slug}`);
  }
}

export async function loginAction(
  _prev: LoginState | null,
  formData: FormData,
): Promise<LoginState> {
  const password = String(formData.get("password") ?? "").trim();

  if (process.env.NODE_ENV === "production" && !isAdminPasswordConfigured()) {
    return FAIL(
      "Admin password is not configured on the server. Add ADMIN_PASSWORD in Vercel → Settings → Environment Variables, then Redeploy.",
    );
  }

  if (!verifyAdminPassword(password)) {
    return FAIL("Invalid password.");
  }

  const store = await cookies();
  store.set(getAdminCookieName(), createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getAdminCookieMaxAge(),
  });

  const from = String(formData.get("from") ?? "/admin");
  const redirectTo = from.startsWith("/admin") ? from : "/admin";
  return { ok: true, message: "", redirectTo };
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(getAdminCookieName());
  redirect("/admin/login");
}

export async function saveSiteSettingsAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const locale = parseLocale(formData);
    const current = await readSiteContent(locale);

    const site: SiteSettings = {
      ...current.site,
      name: String(formData.get("name") ?? current.site.name),
      shortName: String(formData.get("shortName") ?? current.site.shortName),
      tagline: String(formData.get("tagline") ?? current.site.tagline),
      description: String(formData.get("description") ?? current.site.description),
      url: String(formData.get("url") ?? current.site.url),
      email: String(formData.get("email") ?? current.site.email),
      location: String(formData.get("location") ?? current.site.location),
      founded: Number(formData.get("founded") ?? current.site.founded),
      cta: {
        label: String(formData.get("ctaLabel") ?? current.site.cta.label),
        href: String(formData.get("ctaHref") ?? current.site.cta.href),
      },
      social: {
        twitter: String(formData.get("socialTwitter") ?? current.site.social.twitter),
        github: String(formData.get("socialGithub") ?? current.site.social.github),
        dribbble: String(formData.get("socialDribbble") ?? current.site.social.dribbble),
        linkedin: String(formData.get("socialLinkedin") ?? current.site.social.linkedin),
      },
      nav: parseNavRows(formData),
      authors: current.site.authors,
      keywords: current.site.keywords,
      ogImage: current.site.ogImage,
      locale: current.site.locale,
    };

    await writeSiteContent({ ...current, site }, locale);
    revalidateMarketing();
    return saveOk();
  } catch (e) {
    return FAIL(e instanceof Error ? e.message : "Could not save settings.");
  }
}

function parseNavRows(formData: FormData): { label: string; href: string }[] {
  const labels = formData.getAll("navLabel").map(String);
  const hrefs = formData.getAll("navHref").map(String);
  return labels
    .map((label, i) => ({ label: label.trim(), href: (hrefs[i] ?? "").trim() }))
    .filter((item) => item.label && item.href);
}

export async function saveSectionsAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const locale = parseLocale(formData);
    const current = await readSiteContent(locale);
    const section = String(formData.get("section") ?? "");

    const sections: SiteSections = { ...current.sections };

    if (section === "hero") {
      sections.hero = {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        title: String(formData.get("title") ?? ""),
        titleEmphasis: String(formData.get("titleEmphasis") ?? ""),
        description: String(formData.get("description") ?? ""),
        primaryCta: {
          label: String(formData.get("primaryCtaLabel") ?? ""),
          href: String(formData.get("primaryCtaHref") ?? ""),
        },
        secondaryCta: {
          label: String(formData.get("secondaryCtaLabel") ?? ""),
          href: String(formData.get("secondaryCtaHref") ?? ""),
        },
        scrollLabel: String(formData.get("scrollLabel") ?? ""),
      };
    } else if (section === "work") {
      sections.work = {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        heading: String(formData.get("heading") ?? ""),
        intro: String(formData.get("intro") ?? ""),
      };
    } else if (section === "services") {
      sections.services = {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        heading: String(formData.get("heading") ?? ""),
        intro: String(formData.get("intro") ?? ""),
        items: parseServiceRows(formData),
      };
    } else if (section === "process") {
      sections.process = {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        heading: String(formData.get("heading") ?? ""),
        intro: String(formData.get("intro") ?? ""),
        steps: parseProcessRows(formData),
      };
    } else if (section === "marquee") {
      sections.marquee = { items: parseMarqueeRows(formData) };
    } else if (section === "cta") {
      sections.cta = {
        eyebrow: String(formData.get("eyebrow") ?? ""),
        heading: String(formData.get("heading") ?? ""),
        headingEmphasis: String(formData.get("headingEmphasis") ?? ""),
        description: String(formData.get("description") ?? ""),
        mailtoSubject: String(formData.get("mailtoSubject") ?? ""),
      };
    } else {
      return FAIL("Unknown section.");
    }

    await writeSiteContent({ ...current, sections }, locale);
    revalidateMarketing();
    return saveOk();
  } catch (e) {
    return FAIL(e instanceof Error ? e.message : "Could not save section.");
  }
}

function parseServiceRows(formData: FormData) {
  const titles = formData.getAll("serviceTitle").map(String);
  const descriptions = formData.getAll("serviceDescription").map(String);
  return titles
    .map((title, i) => ({
      title: title.trim(),
      description: (descriptions[i] ?? "").trim(),
    }))
    .filter((item) => item.title);
}

function parseProcessRows(formData: FormData) {
  const numbers = formData.getAll("stepNumber").map(String);
  const titles = formData.getAll("stepTitle").map(String);
  const descriptions = formData.getAll("stepDescription").map(String);
  return numbers
    .map((number, i) => ({
      number: number.trim(),
      title: (titles[i] ?? "").trim(),
      description: (descriptions[i] ?? "").trim(),
    }))
    .filter((item) => item.title);
}

function parseMarqueeRows(formData: FormData) {
  const labels = formData.getAll("marqueeLabel").map(String);
  const values = formData.getAll("marqueeValue").map(String);
  return labels
    .map((label, i) => ({ label: label.trim(), value: (values[i] ?? "").trim() }))
    .filter((item) => item.label);
}

export async function saveWorkProjectAction(
  _prev: ActionState | null,
  formData: FormData,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const locale = parseLocale(formData);
    const slug = String(formData.get("slug") ?? "").trim();
    if (!slug) return FAIL("Slug is required.");

    const project: WorkProject = {
      slug,
      title: String(formData.get("title") ?? ""),
      category: String(formData.get("category") ?? ""),
      year: String(formData.get("year") ?? ""),
      description: String(formData.get("description") ?? ""),
      stack: String(formData.get("stack") ?? "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      accent: String(formData.get("accent") ?? ""),
      glow: String(formData.get("glow") ?? ""),
      body: String(formData.get("body") ?? ""),
    };

    const work = await readWorkContent(locale);
    const index = work.projects.findIndex((p) => p.slug === slug);
    const projects = [...work.projects];
    if (index >= 0) {
      projects[index] = project;
    } else {
      projects.push(project);
    }

    await writeWorkContent({ projects }, locale);
    revalidateMarketing();
    revalidateWorkSlug(slug);
    return saveOk();
  } catch (e) {
    return FAIL(e instanceof Error ? e.message : "Could not save project.");
  }
}

export async function deleteWorkProjectAction(
  slug: string,
  locale: string = defaultLocale,
): Promise<ActionState> {
  try {
    await requireAdmin();
    const loc = isValidLocale(locale) ? locale : defaultLocale;
    const work = await readWorkContent(loc);
    const projects = work.projects.filter((p) => p.slug !== slug);
    if (projects.length === work.projects.length) {
      return FAIL("Project not found.");
    }
    await writeWorkContent({ projects }, loc);
    revalidateMarketing();
    revalidateWorkSlug(slug);
    return saveOk();
  } catch (e) {
    return FAIL(e instanceof Error ? e.message : "Could not delete project.");
  }
}
