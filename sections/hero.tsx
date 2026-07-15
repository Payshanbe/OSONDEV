"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { HeroParticles } from "@/components/hero-particles";
import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { Button } from "@/components/ui/button";

const heroMeta = {
  en: {
    edition: "OSONDEV / 01",
    focusLabel: "Focus",
    focus: "Product · Web · Motion",
    reachLabel: "Working",
    reach: "Dushanbe · Worldwide",
    workLabel: "Selected work",
  },
  ru: {
    edition: "OSONDEV / 01",
    focusLabel: "Фокус",
    focus: "Продукт · Веб · Motion",
    reachLabel: "Работаем",
    reach: "Душанбе · По всему миру",
    workLabel: "Избранные проекты",
  },
} as const;

export function HeroSection() {
  const { sections } = useSiteContent();
  const locale = useLocale();
  const hero = sections.hero;
  const meta = heroMeta[locale];

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <HeroParticles intensity={0.5} mobileIntensityScale={0.62} />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] bg-[linear-gradient(90deg,hsl(var(--background)/0.82)_0%,hsl(var(--background)/0.22)_48%,hsl(var(--background)/0.5)_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-2/3 bg-gradient-to-t from-background via-background/25 to-transparent"
      />

      <Reveal.Group when="mount" className="relative z-10 min-h-[100svh]">
        <div className="container-wide flex min-h-[100svh] flex-col justify-end pb-8 pt-32 sm:pb-10 sm:pt-40 lg:pb-12">
          <div className="grid border-y border-white/15 lg:grid-cols-12">
            <div className="py-10 sm:py-14 lg:col-span-8 lg:py-16 lg:pr-12 xl:pr-16">
              <Reveal.Item
                as="span"
                className="inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.28em] text-foreground/65"
              >
                <span className="h-px w-8 bg-foreground/50" aria-hidden />
                <span className="relative flex h-1.5 w-1.5" aria-hidden>
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                {hero.eyebrow}
              </Reveal.Item>

              <Reveal.Item as="h1" id="hero-heading" className="mt-9 text-balance">
                <span className="block text-foreground">{hero.title}</span>
                <span className="text-foreground/48 block font-normal">{hero.titleEmphasis}</span>
              </Reveal.Item>
            </div>

            <div className="flex flex-col justify-between border-t border-white/15 py-9 lg:col-span-4 lg:border-l lg:border-t-0 lg:py-16 lg:pl-10 xl:pl-12">
              <Reveal.Item>
                <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground/70">
                  {meta.edition}
                </p>
                <p className="text-foreground/72 mt-6 max-w-md text-base leading-relaxed sm:text-lg lg:text-base xl:text-lg">
                  {hero.description}
                </p>
              </Reveal.Item>

              <Reveal.Item className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 lg:mt-12">
                <Magnetic>
                  <Button asChild size="lg" className="rounded-none px-7">
                    <Link href={hero.primaryCta.href} aria-label={hero.primaryCta.label}>
                      {hero.primaryCta.label}
                      <ArrowUpRight aria-hidden />
                    </Link>
                  </Button>
                </Magnetic>
                <Link
                  href={hero.secondaryCta.href}
                  className="group inline-flex h-12 items-center border-b border-foreground/35 text-sm font-medium text-foreground transition-colors hover:border-foreground"
                >
                  {hero.secondaryCta.label}
                  <ArrowDown
                    aria-hidden
                    className="ml-2 size-3.5 transition-transform duration-300 group-hover:translate-y-1"
                  />
                </Link>
              </Reveal.Item>

              <Reveal.Item className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-6 lg:mt-14">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/55">
                    {meta.focusLabel}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">{meta.focus}</p>
                </div>
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/55">
                    {meta.reachLabel}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground/70">{meta.reach}</p>
                </div>
              </Reveal.Item>
            </div>
          </div>

          <Reveal.Item className="flex items-end justify-between pt-7">
            <div className="flex items-center" aria-hidden>
              <span className="block size-8 rounded-full border border-foreground/35" />
              <span className="-ml-2.5 block size-8 rounded-full border border-foreground/55" />
            </div>

            <Link
              href="#work"
              className="group inline-flex items-center gap-4 font-mono text-[9px] uppercase tracking-[0.28em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {meta.workLabel}
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                className="inline-flex"
              >
                <ArrowDown className="size-3" aria-hidden />
              </motion.span>
            </Link>
          </Reveal.Item>
        </div>
      </Reveal.Group>
    </section>
  );
}
