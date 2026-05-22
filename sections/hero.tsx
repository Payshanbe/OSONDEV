"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import { HeroParticles } from "@/components/hero-particles";
import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { useSiteContent } from "@/components/site-content-provider";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { sections } = useSiteContent();
  const hero = sections.hero;

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative isolate min-h-[100svh]"
    >
      <HeroParticles intensity={0.5} />

      <Reveal.Group
        when="mount"
        className="relative z-10 flex min-h-[100svh] flex-col items-center justify-center"
      >
        <div className="container-wide w-full">
          <div className="mx-auto flex max-w-5xl flex-col items-center text-center">
            <Reveal.Item as="span" className="eyebrow">
              <span className="relative flex h-1.5 w-1.5" aria-hidden>
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {hero.eyebrow}
            </Reveal.Item>

            <Reveal.Item
              as="h1"
              id="hero-heading"
              className="mt-9 w-full text-balance bg-gradient-to-b from-white via-white to-white/80 bg-clip-text text-transparent text-[clamp(2.5rem,6.5vw,5rem)] leading-[0.98] tracking-[-0.035em]"
            >
              {hero.title}{" "}
              <span className="font-serif font-normal italic tracking-[-0.02em]">
                {hero.titleEmphasis}
              </span>
            </Reveal.Item>

            <Reveal.Item
              as="p"
              className="mt-8 max-w-xl text-balance text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.55]"
            >
              {hero.description}
            </Reveal.Item>

            <Reveal.Item className="mt-11 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Magnetic className="justify-center sm:justify-start">
                <Button asChild size="lg">
                  <Link href={hero.primaryCta.href} aria-label={hero.primaryCta.label}>
                    {hero.primaryCta.label}
                    <ArrowUpRight aria-hidden />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="outline">
                <Link href={hero.secondaryCta.href}>{hero.secondaryCta.label}</Link>
              </Button>
            </Reveal.Item>
          </div>
        </div>

        <Reveal.Item
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center sm:bottom-10"
        >
          <div className="flex flex-col items-center gap-2.5 text-muted-foreground/70">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em]">
              {hero.scrollLabel}
            </span>
            <motion.span
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex"
            >
              <ArrowDown className="size-3" />
            </motion.span>
          </div>
        </Reveal.Item>
      </Reveal.Group>
    </section>
  );
}
