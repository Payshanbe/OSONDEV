"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Magnetic } from "@/components/magnetic";
import { useProjectInquiry } from "@/components/project-inquiry";
import { RevealGroup, RevealItem } from "@/components/reveal";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { Button } from "@/components/ui/button";

const contactMeta = {
  en: {
    index: "05 / Contact",
    availability: "Available for new projects",
    responseLabel: "Response",
    response: "Within 1 business day",
    reachLabel: "Working",
    reach: "Dushanbe · Worldwide",
  },
  ru: {
    index: "05 / Контакт",
    availability: "Открыты для новых проектов",
    responseLabel: "Ответ",
    response: "В течение 1 рабочего дня",
    reachLabel: "Работаем",
    reach: "Душанбе · По всему миру",
  },
} as const;

export function CtaSection() {
  const { site, sections } = useSiteContent();
  const locale = useLocale();
  const cta = sections.cta;
  const meta = contactMeta[locale];
  const mailto = `mailto:${site.email}?subject=${encodeURIComponent(cta.mailtoSubject)}`;
  const { openProjectInquiry } = useProjectInquiry();

  return (
    <section
      id="contact"
      aria-labelledby="cta-heading"
      className="relative scroll-mt-28 border-t border-border/40 py-24 sm:scroll-mt-32 sm:py-32 lg:py-36"
    >
      <div className="container-wide">
        <RevealGroup
          className="relative overflow-hidden border-y border-white/15"
          staggerChildren={0.1}
          delayChildren={0.05}
        >
          <RevealItem
            variant="fade-in"
            className="flex items-center justify-between border-b border-white/15 py-5"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {meta.index}
            </p>
            <div className="flex items-center gap-2.5 font-mono text-[9px] uppercase tracking-[0.2em] text-foreground/65 sm:text-[10px]">
              <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden />
              {meta.availability}
            </div>
          </RevealItem>

          <div className="grid lg:grid-cols-12">
            <RevealItem className="relative py-14 sm:py-20 lg:col-span-8 lg:py-24 lg:pr-12 xl:pr-20">
              <h2
                id="cta-heading"
                className="max-w-[10ch] text-balance text-[clamp(3rem,7vw,7rem)] font-medium leading-[0.92] tracking-[-0.055em]"
              >
                <span className="block">{cta.heading}</span>
                <span className="text-foreground/48 block font-serif font-normal italic">
                  {cta.headingEmphasis}
                </span>
              </h2>

              <div className="mt-14 flex items-center" aria-hidden>
                <span className="block size-8 rounded-full border border-foreground/30" />
                <span className="-ml-2.5 block size-8 rounded-full border border-foreground/55" />
              </div>
            </RevealItem>

            <RevealItem className="flex flex-col justify-between border-t border-white/15 py-12 lg:col-span-4 lg:border-l lg:border-t-0 lg:py-24 lg:pl-10 xl:pl-12">
              <div>
                <p className="text-foreground/72 max-w-md text-base leading-relaxed sm:text-lg lg:text-base xl:text-lg">
                  {cta.description}
                </p>

                <div className="mt-10 grid grid-cols-2 gap-6 border-t border-white/10 pt-6">
                  <ContactFact label={meta.responseLabel} value={meta.response} />
                  <ContactFact label={meta.reachLabel} value={meta.reach} />
                </div>
              </div>

              <div className="mt-12 border-t border-white/10 pt-7 lg:mt-20">
                <Magnetic className="w-full">
                  <Button
                    type="button"
                    size="lg"
                    onClick={openProjectInquiry}
                    className="w-full rounded-none px-7 shadow-[0_1px_0_0_hsl(0_0%_100%/0.1)_inset] hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.35),0_16px_44px_-16px_hsl(var(--accent)/0.35)]"
                  >
                    {site.cta.label}
                    <ArrowUpRight aria-hidden />
                  </Button>
                </Magnetic>

                <CtaEmailLink email={site.email} mailto={mailto} />
              </div>
            </RevealItem>
          </div>

          <div
            aria-hidden
            className="pointer-events-none absolute bottom-0 right-0 h-px w-2/5 bg-gradient-to-r from-transparent via-accent/55 to-transparent"
          />
        </RevealGroup>
      </div>
    </section>
  );
}

function ContactFact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-muted-foreground/55">
        {label}
      </p>
      <p className="mt-2 text-xs leading-relaxed text-foreground/70">{value}</p>
    </div>
  );
}

function CtaEmailLink({ email, mailto }: { email: string; mailto: string }) {
  return (
    <Link
      href={mailto}
      className="focus-ring group mt-5 inline-flex items-center gap-1.5 rounded-sm py-2 text-sm font-medium text-muted-foreground transition-colors duration-300 hover:text-foreground"
    >
      {email}
      <ArrowUpRight
        className="size-3.5 opacity-60 transition-transform duration-300 group-hover:-translate-y-px group-hover:translate-x-px group-hover:opacity-100"
        aria-hidden
      />
    </Link>
  );
}
