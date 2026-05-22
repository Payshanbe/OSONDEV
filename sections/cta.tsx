"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

import { Magnetic } from "@/components/magnetic";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { useSiteContent } from "@/components/site-content-provider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function CtaSection() {
  const { site, sections } = useSiteContent();
  const cta = sections.cta;
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(cta.mailtoSubject)}`;

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="relative scroll-mt-28 overflow-hidden border-t border-border/40 py-32 sm:scroll-mt-32 sm:py-40"
    >
      <CtaBackdrop />

      <div className="container-wide relative">
        <RevealGroup
          className="mx-auto flex max-w-3xl flex-col items-center text-center"
          staggerChildren={0.1}
          delayChildren={0.06}
        >
          <RevealItem variant="fade-in">
            <p className="eyebrow">{cta.eyebrow}</p>
          </RevealItem>

          <RevealItem>
            <h2
              id="cta-heading"
              className="mt-8 text-display-xl font-medium tracking-tight text-balance"
            >
              {cta.heading}{" "}
              <span className="font-serif italic font-normal text-muted-foreground">
                {cta.headingEmphasis}
              </span>
            </h2>
          </RevealItem>

          <RevealItem>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg sm:leading-[1.55]">
              {cta.description}
            </p>
          </RevealItem>

          <RevealItem variant="scale-soft">
            <div className="mt-11 flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
              <Magnetic>
                <Button
                  asChild
                  size="lg"
                  className={cn(
                    "shadow-[0_1px_0_0_hsl(0_0%_100%/0.1)_inset]",
                    "transition-all duration-300",
                    "hover:-translate-y-0.5",
                    "hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.45),0_16px_48px_-10px_hsl(var(--accent)/0.4)]",
                  )}
                >
                  <Link href={mailto}>
                    {site.cta.label}
                    <ArrowUpRight aria-hidden />
                  </Link>
                </Button>
              </Magnetic>

              <CtaEmailLink email={site.email} mailto={mailto} />
            </div>
          </RevealItem>
        </RevealGroup>
      </div>
    </section>
  );
}

function CtaEmailLink({ email, mailto }: { email: string; mailto: string }) {
  return (
    <Link
      href={mailto}
      className="group relative inline-flex items-center gap-1.5 py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground focus-ring rounded-sm"
    >
      {email}
      <ArrowUpRight
        className="size-3.5 opacity-60 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100"
        aria-hidden
      />
      <span
        aria-hidden
        className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-foreground/70 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}

function CtaBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background" />

      <motion.div
        className="absolute left-1/2 top-1/2 h-[32rem] w-[48rem] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, hsl(263 70% 58% / 0.22), hsl(263 70% 58% / 0.06) 50%, transparent 75%)",
        }}
        animate={{
          x: ["-2%", "2%", "-2%"],
          y: ["-1%", "1%", "-1%"],
          scale: [1, 1.04, 1],
        }}
        transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-1/4 h-[24rem] w-[32rem] -translate-x-1/2 rounded-full blur-3xl opacity-70 will-change-transform"
        style={{
          background:
            "radial-gradient(closest-side, hsl(199 88% 54% / 0.14), transparent 70%)",
        }}
        animate={{
          x: [0, "3%", 0],
          opacity: [0.5, 0.75, 0.5],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute inset-x-[15%] top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      />
    </div>
  );
}
