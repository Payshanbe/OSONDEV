import type { ReactNode } from "react";

import { saveSectionsAction } from "@/app/(admin)/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminLocaleTabs } from "@/components/admin/locale-tabs";
import { FormField } from "@/components/admin/form-field";
import { readSiteContent } from "@/lib/content/storage";
import { resolveAdminLocale } from "@/lib/admin/resolve-locale";
import type { Locale } from "@/lib/i18n/config";

export default async function AdminSectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = resolveAdminLocale(localeParam);
  const { sections } = await readSiteContent(locale);

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        Sections
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Page sections</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Homepage copy by section. Save each block independently.
      </p>

      <AdminLocaleTabs basePath="/admin/sections" activeLocale={locale} />

      <div className="mt-12 space-y-16">
        <SectionBlock title="Hero" section="hero" locale={locale}>
          <FormField label="Eyebrow" name="eyebrow" defaultValue={sections.hero.eyebrow} />
          <FormField label="Title" name="title" defaultValue={sections.hero.title} />
          <FormField
            label="Title emphasis (italic)"
            name="titleEmphasis"
            defaultValue={sections.hero.titleEmphasis}
          />
          <FormField
            label="Description"
            name="description"
            defaultValue={sections.hero.description}
            multiline
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              label="Primary CTA label"
              name="primaryCtaLabel"
              defaultValue={sections.hero.primaryCta.label}
            />
            <FormField
              label="Primary CTA link"
              name="primaryCtaHref"
              defaultValue={sections.hero.primaryCta.href}
            />
            <FormField
              label="Secondary CTA label"
              name="secondaryCtaLabel"
              defaultValue={sections.hero.secondaryCta.label}
            />
            <FormField
              label="Secondary CTA link"
              name="secondaryCtaHref"
              defaultValue={sections.hero.secondaryCta.href}
            />
          </div>
          <FormField label="Scroll label" name="scrollLabel" defaultValue={sections.hero.scrollLabel} />
        </SectionBlock>

        <SectionBlock title="Work (intro)" section="work" locale={locale}>
          <FormField label="Eyebrow" name="eyebrow" defaultValue={sections.work.eyebrow} />
          <FormField label="Heading" name="heading" defaultValue={sections.work.heading} />
          <FormField label="Intro" name="intro" defaultValue={sections.work.intro} multiline />
        </SectionBlock>

        <SectionBlock title="Services" section="services" locale={locale}>
          <FormField label="Eyebrow" name="eyebrow" defaultValue={sections.services.eyebrow} />
          <FormField label="Heading" name="heading" defaultValue={sections.services.heading} />
          <FormField label="Intro" name="intro" defaultValue={sections.services.intro} multiline />
          <ul className="space-y-6 border-t border-border/40 pt-6">
            {sections.services.items.map((item, i) => (
              <li key={i} className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Service {i + 1}
                </p>
                <FormField label="Title" name="serviceTitle" defaultValue={item.title} />
                <FormField
                  label="Description"
                  name="serviceDescription"
                  defaultValue={item.description}
                  multiline
                />
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Process" section="process" locale={locale}>
          <FormField label="Eyebrow" name="eyebrow" defaultValue={sections.process.eyebrow} />
          <FormField label="Heading" name="heading" defaultValue={sections.process.heading} />
          <FormField label="Intro" name="intro" defaultValue={sections.process.intro} multiline />
          <ul className="space-y-6 border-t border-border/40 pt-6">
            {sections.process.steps.map((step, i) => (
              <li key={i} className="grid gap-3 sm:grid-cols-3">
                <FormField label="Number" name="stepNumber" defaultValue={step.number} />
                <FormField label="Title" name="stepTitle" defaultValue={step.title} />
                <FormField
                  label="Description"
                  name="stepDescription"
                  defaultValue={step.description}
                  className="sm:col-span-1"
                />
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Studio marquee" section="marquee" locale={locale}>
          <ul className="space-y-4">
            {sections.marquee.items.map((item, i) => (
              <li key={i} className="grid gap-3 sm:grid-cols-2">
                <FormField label="Label" name="marqueeLabel" defaultValue={item.label} />
                <FormField label="Value" name="marqueeValue" defaultValue={item.value} />
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title="Contact / CTA" section="cta" locale={locale}>
          <FormField label="Eyebrow" name="eyebrow" defaultValue={sections.cta.eyebrow} />
          <FormField label="Heading" name="heading" defaultValue={sections.cta.heading} />
          <FormField
            label="Heading emphasis"
            name="headingEmphasis"
            defaultValue={sections.cta.headingEmphasis}
          />
          <FormField
            label="Description"
            name="description"
            defaultValue={sections.cta.description}
            multiline
          />
          <FormField
            label="Email subject"
            name="mailtoSubject"
            defaultValue={sections.cta.mailtoSubject}
          />
        </SectionBlock>
      </div>
    </div>
  );
}

function SectionBlock({
  title,
  section,
  locale,
  children,
}: {
  title: string;
  section: string;
  locale: Locale;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border/60 bg-secondary/15 p-6 sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <AdminForm action={saveSectionsAction} locale={locale} submitLabel={`Save ${title}`}>
        <input type="hidden" name="section" value={section} />
        <div className="mt-6 space-y-5">{children}</div>
      </AdminForm>
    </section>
  );
}
