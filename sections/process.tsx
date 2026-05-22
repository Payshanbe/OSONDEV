"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { useSiteContent } from "@/components/site-content-provider";
import { cn } from "@/lib/utils";

export function ProcessSection() {
  const { sections } = useSiteContent();
  const process = sections.process;

  return (
    <section
      id="process"
      aria-labelledby="process-heading"
      className="relative scroll-mt-28 border-t border-border/40 py-28 sm:scroll-mt-32 sm:py-36"
    >
      <div className="container-wide">
        <div className="grid gap-16 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <Reveal delay={0}>
              <p className="eyebrow">{process.eyebrow}</p>
            </Reveal>

            <Reveal delay={0.06}>
              <h2
                id="process-heading"
                className="mt-6 max-w-md text-display-lg font-medium tracking-tight text-balance"
              >
                {process.heading}
              </h2>
            </Reveal>

            <Reveal delay={0.12}>
              <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {process.intro}
              </p>
            </Reveal>
          </div>

          <RevealGroup
            className="relative"
            staggerChildren={0.09}
            delayChildren={0.04}
          >
            <div
              aria-hidden
              className="absolute bottom-0 left-[1.125rem] top-0 w-px bg-gradient-to-b from-border/80 via-border/40 to-transparent sm:left-5"
            />

            <ol className="relative space-y-0">
              {process.steps.map((step, index) => (
                <RevealItem key={step.number}>
                  <li
                    className={cn(
                      "group relative grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-10 sm:gap-x-10 sm:py-12",
                      index !== process.steps.length - 1 && "border-b border-border/40",
                    )}
                  >
                    <span className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full border border-border/70 bg-background font-mono text-[11px] tabular-nums text-muted-foreground transition-colors duration-300 group-hover:border-border group-hover:text-foreground sm:h-10 sm:w-10">
                      {step.number}
                    </span>

                    <div className="min-w-0 pt-0.5">
                      <h3 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-[15px] leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </li>
                </RevealItem>
              ))}
            </ol>
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
