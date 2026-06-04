import type { Metadata } from "next";
import Link from "next/link";

import { normalizeWorkProject } from "@/lib/content/normalize-work-project";
import { WorkProjectGallery } from "@/components/work-project-media";
import { WorkProjectCover } from "@/components/work-project-cover";
import { Button } from "@/components/ui/button";
import { getWorkProject, getWorkProjects } from "@/lib/content";
import { buildMetadata } from "@/lib/metadata";
import { isValidLocale, locales, type Locale } from "@/lib/i18n/config";
import { homePath } from "@/lib/i18n/paths";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    const projects = await getWorkProjects(locale);
    for (const p of projects) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  const project = await getWorkProject(slug, locale);
  if (!project) return {};

  return buildMetadata({
    title: `${project.title}`,
    description: project.description,
    path: `/work/${slug}`,
    locale,
  });
}

const copy = {
  en: {
    unknown: "Unknown project",
    back: "Back to studio",
    allWork: "All work",
    discuss: "Discuss a similar engagement",
    bodyFallback:
      "Extended case narratives, outcome metrics, and process notes are prepared for qualified conversations.",
  },
  ru: {
    unknown: "Проект не найден",
    back: "На главную",
    allWork: "Все работы",
    discuss: "Обсудить похожий проект",
    bodyFallback:
      "Развёрнутые кейсы и метрики готовим для заинтересованных клиентов.",
  },
} as const;

export default async function WorkCasePage({ params }: Props) {
  const { locale: localeParam, slug } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;
  const t = copy[locale];

  const project = await getWorkProject(slug, locale);

  if (!project) {
    return (
      <div className="container-tight py-32">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {t.unknown}
        </p>
        <Button asChild className="mt-8">
          <Link href={homePath(locale)}>{t.back}</Link>
        </Button>
      </div>
    );
  }

  const body = project.body ?? t.bodyFallback;
  const normalized = normalizeWorkProject(project);
  const gallery = normalized.gallery ?? [];

  return (
    <article className="relative border-t border-border/40">
      <div className="container-tight py-24 sm:py-32">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {project.category} · {project.year}
        </p>
        <h1 className="mt-4 text-display-xl font-semibold tracking-tight">
          {project.title}
        </h1>
        <div className="mt-10">
          {gallery.length > 1 ? (
            <WorkProjectGallery items={gallery} title={project.title} variant="grid" />
          ) : (
            <WorkProjectCover project={project} variant="hero" />
          )}
        </div>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {project.description}
        </p>
        <p className="mt-14 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {body}
        </p>
        <div className="mt-12 flex flex-wrap gap-3">
          {project.stack.map((item) => (
            <span
              key={item}
              className="rounded-full border border-border/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground"
            >
              {item}
            </span>
          ))}
        </div>
        <div className="mt-16 flex flex-wrap gap-4">
          <Button asChild variant="outline">
            <Link href={`${homePath(locale)}#work`}>{t.allWork}</Link>
          </Button>
          <Button asChild>
            <Link href={`${homePath(locale)}#contact`}>{t.discuss}</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
