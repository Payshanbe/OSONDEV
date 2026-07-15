"use client";

import { RevealGroup, RevealItem } from "@/components/reveal";
import { useLocale, useSiteContent } from "@/components/site-content-provider";

export function StudioMarquee() {
  const { sections } = useSiteContent();
  const locale = useLocale();
  const { items } = sections.marquee;

  return (
    <section
      aria-label={locale === "ru" ? "Информация о студии OSONDEV" : "OSONDEV studio details"}
      className="relative border-y border-border/60 bg-secondary/20"
    >
      <div className="container-wide">
        <RevealGroup
          className="grid grid-cols-2 divide-x divide-border/60 sm:grid-cols-4"
          staggerChildren={0.06}
          delayChildren={0.04}
        >
          {items.map((item) => (
            <RevealItem
              key={item.label}
              variant="fade-in"
              className="flex flex-col gap-1.5 px-2 py-6 sm:px-6"
            >
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">
                {item.label}
              </span>
              <span className="text-sm font-medium text-foreground/90 sm:text-base">
                {item.value}
              </span>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
