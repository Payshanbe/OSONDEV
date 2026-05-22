"use client";

import Link from "next/link";
import { motion } from "framer-motion";

import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
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
            className="mt-6 max-w-2xl text-display-lg font-medium tracking-tight text-balance"
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

function ProjectCard({
  slug,
  title,
  category,
  year,
  description,
  stack,
  accent,
  glow,
}: WorkProject) {
  const locale = useLocale();

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

        <div className="relative overflow-hidden rounded-t-[15px]">
          <div
            aria-hidden
            className={cn(
              "relative aspect-[16/10] w-full bg-gradient-to-br from-muted/90 to-muted/40",
              "before:absolute before:inset-0 before:bg-gradient-to-t before:from-background/80 before:via-transparent before:to-transparent",
            )}
            style={{ backgroundColor: accent }}
          >
            <motion.div
              className="absolute inset-[12%] rounded-lg border border-white/10 bg-background/45 shadow-2xl backdrop-blur-sm"
              whileHover={{ scale: 1.03 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="flex h-full flex-col p-4 sm:p-5">
                <div className="flex gap-1.5 pb-4">
                  <span className="h-2 w-2 rounded-full bg-white/25" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                  <span className="h-2 w-2 rounded-full bg-white/15" />
                </div>
                <div className="flex flex-1 gap-3">
                  <div className="w-2/5 space-y-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
                    <div className="h-1 rounded bg-white/20" />
                    <div className="h-1 w-[85%] rounded bg-white/10" />
                    <div className="h-1 w-[66%] rounded bg-white/10" />
                    <div className="mt-auto h-8 rounded bg-gradient-to-r from-white/18 to-transparent" />
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <div className="h-24 rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent" />
                    <div className="grid flex-1 grid-cols-2 gap-2">
                      <div className="rounded-md border border-white/10 bg-white/[0.04]" />
                      <div className="rounded-md border border-white/10 bg-white/[0.04]" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

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
              Case study
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
