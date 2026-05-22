"use client";

import { motion } from "framer-motion";

import { Reveal, RevealGroup, RevealItem } from "@/components/reveal";
import { useSiteContent } from "@/components/site-content-provider";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/lib/content/types";

/**
 * What the studio delivers — scannable, minimal, conversion-clear.
 */
export function ServicesSection() {
  const { sections } = useSiteContent();
  const services = sections.services;

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="relative scroll-mt-28 border-t border-border/40 py-28 sm:scroll-mt-32 sm:py-36"
    >
      <div className="container-wide">
        <Reveal delay={0}>
          <p className="eyebrow">{services.eyebrow}</p>
        </Reveal>

        <Reveal delay={0.06}>
          <h2
            id="services-heading"
            className="mt-6 max-w-2xl text-display-lg font-medium tracking-tight text-balance"
          >
            {services.heading}
          </h2>
        </Reveal>

        <Reveal delay={0.12}>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-base">
            {services.intro}
          </p>
        </Reveal>

        <RevealGroup
          className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-border/60 bg-border/60 sm:grid-cols-2"
          staggerChildren={0.07}
          delayChildren={0.06}
        >
          {services.items.map((service, index) => (
            <RevealItem key={service.title} variant="fade-in">
              <ServiceItem
                service={service}
                index={index}
                isLast={index === services.items.length - 1}
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}

function ServiceItem({
  service,
  index,
  isLast,
}: {
  service: ServiceItem;
  index: number;
  isLast: boolean;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.005 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "group relative flex flex-col gap-4 bg-background/95 p-8 sm:p-10",
        "transition-colors duration-500 hover:bg-secondary/35",
        isLast && "sm:col-span-2 sm:flex-row sm:items-center sm:justify-between sm:gap-12",
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-8 top-0 h-px scale-x-0 bg-gradient-to-r from-transparent via-accent/50 to-transparent transition-transform duration-500 group-hover:scale-x-100 sm:inset-x-10"
      />

      <div className={cn(isLast && "sm:max-w-lg")}>
        <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-[1.35rem]">
          {service.title}
        </h3>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          {service.description}
        </p>
      </div>

      <span className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground/80">
        0{index + 1}
      </span>
    </motion.div>
  );
}
