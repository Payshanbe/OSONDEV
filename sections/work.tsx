"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { WorkProjectCover } from "@/components/work-project-cover";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { workPath } from "@/lib/i18n/paths";
import type { WorkProject } from "@/lib/content/types";
import { cn } from "@/lib/utils";

/**
 * Curated case-study grid — quiet hierarchy, long spacing, motion that
 * reads as material under the thumb rather than spectacle.
 */
export function WorkSection({ projects }: { projects: WorkProject[] }) {
  const { sections } = useSiteContent();
  const work = sections.work;

  return (
    <section
      id="work"
      aria-labelledby="work-heading"
      className="relative scroll-mt-28 border-t border-border/40 py-28 sm:scroll-mt-32 sm:py-36"
    >
      <div className="container-wide">
        <Reveal delay={0}>
          <p className="eyebrow">{work.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            id="work-heading"
            className="mt-6 max-w-2xl text-balance text-display-lg font-medium tracking-tight"
          >
            {work.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {work.intro}
          </p>
        </Reveal>

        <RevealGroup
          className="mt-16 grid gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-14"
          staggerChildren={0.1}
          delayChildren={0.08}
        >
          {projects.map((project) => (
            <RevealItem key={project.slug}>
              <ProjectCard {...project} />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ProjectCard(project: WorkProject) {
  const { slug, title, category, year, description, stack, glow } = project;
  const locale = useLocale();
  const caseLabel = locale === "ru" ? "О проекте" : "Case study";

  return (
    <motion.article
      whileHover={{ y: -4 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      className="group relative h-full"
    >
      <Link
        prefetch={false}
        href={workPath(slug, locale)}
        className={cn(
          "relative flex h-full flex-col overflow-hidden rounded-2xl",
          "border border-border/50 bg-secondary/25",
          "shadow-[inset_0_1px_0_0_hsl(var(--border)/0.6)]",
          "transition-[box-shadow,border-color] duration-500 ease-out",
          "hover:border-border/70 hover:shadow-[0_28px_72px_-24px_rgb(255_255_255/0.06)]",
        )}
      >
        <span
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse 90% 40% at 50% -10%, ${glow}, transparent 70%)`,
          }}
        />

        <WorkProjectCover project={project} variant="card" />

        <div className="relative flex flex-1 flex-col gap-4 p-8 sm:p-9">
          <div className="flex items-center justify-between gap-4 border-b border-border/40 pb-5">
            <div className="flex items-baseline gap-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                {category}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
                {year}
              </span>
            </div>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              {caseLabel}
            </span>
          </div>

          <h3 className="text-2xl font-semibold tracking-tight text-foreground sm:text-[1.65rem] sm:leading-tight">
            {title}
          </h3>
          <p className="line-clamp-2 max-w-md text-[15px] leading-relaxed text-muted-foreground">
            {description}
          </p>

          <ul className="mt-auto flex flex-wrap gap-2 pt-6">
            {stack.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-border/60 bg-background/40 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/90"
              >
                {tag}
              </li>
            ))}
          </ul>
        </div>
      </Link>
    </motion.article>
  );
}
