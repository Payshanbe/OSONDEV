import type { Metadata } from "next";

import { buildMetadata } from "@/lib/metadata";
import { getWorkProjects } from "@/lib/content";
import { isValidLocale, type Locale } from "@/lib/i18n/config";
import { notFound } from "next/navigation";
import { HeroSection } from "@/sections/hero";
import { WorkSection } from "@/sections/work";
import { StudioMarquee } from "@/sections/studio-marquee";
import { ServicesSection } from "@/sections/services";
import { ProcessSection } from "@/sections/process";
import { CtaSection } from "@/sections/cta";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) return {};
  const locale = localeParam as Locale;
  return buildMetadata({ path: "/", locale });
}

export default async function HomePage({ params }: Props) {
  const { locale: localeParam } = await params;
  if (!isValidLocale(localeParam)) notFound();
  const locale = localeParam as Locale;

  const projects = await getWorkProjects(locale);

  return (
    <>
      <HeroSection />
      <WorkSection projects={projects} />
      <ServicesSection />
      <ProcessSection />
      <StudioMarquee />
      <CtaSection />
    </>
  );
}
