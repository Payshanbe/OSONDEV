import { saveSiteSettingsAction } from "@/app/(admin)/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminLocaleTabs } from "@/components/admin/locale-tabs";
import { FormField } from "@/components/admin/form-field";
import { SocialFieldsEditor } from "@/components/admin/social-fields";
import { readSiteContent } from "@/lib/content/storage";
import type { SiteSettings } from "@/lib/content/types";
import { resolveAdminLocale } from "@/lib/admin/resolve-locale";

export default async function AdminSitePage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = resolveAdminLocale(localeParam);
  const { site } = await readSiteContent(locale);

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        Settings
      </p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight">Site settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Branding, contact, navigation, and primary CTA used in the header and footer.
      </p>

      <AdminLocaleTabs basePath="/admin/site" activeLocale={locale} />

      <div className="mt-10">
        <AdminForm action={saveSiteSettingsAction} locale={locale}>
          <SiteSettingsFields site={site} />
        </AdminForm>
      </div>
    </div>
  );
}

function SiteSettingsFields({ site }: { site: SiteSettings }) {
  return (
    <>
      <section className="grid gap-5 sm:grid-cols-2">
        <FormField label="Studio name" name="name" defaultValue={site.name} />
        <FormField label="Short name" name="shortName" defaultValue={site.shortName} />
        <FormField label="Tagline" name="tagline" defaultValue={site.tagline} className="sm:col-span-2" />
        <FormField
          label="Description"
          name="description"
          defaultValue={site.description}
          multiline
          className="sm:col-span-2"
        />
        <FormField label="Site URL" name="url" defaultValue={site.url} type="url" />
        <FormField label="Email" name="email" defaultValue={site.email} type="email" />
        <FormField label="Location" name="location" defaultValue={site.location} className="sm:col-span-2" />
        <FormField label="Founded" name="founded" defaultValue={site.founded} type="number" />
      </section>

      <section className="space-y-4 border-t border-border/50 pt-8">
        <h2 className="text-sm font-semibold">Primary CTA</h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Label" name="ctaLabel" defaultValue={site.cta.label} />
          <FormField label="Link" name="ctaHref" defaultValue={site.cta.href} />
        </div>
      </section>

      <section className="space-y-4 border-t border-border/50 pt-8">
        <h2 className="text-sm font-semibold">Navigation</h2>
        <ul className="space-y-3">
          {site.nav.map((item, i) => (
            <li key={i} className="grid gap-3 sm:grid-cols-2">
              <FormField label={`Link ${i + 1} label`} name="navLabel" defaultValue={item.label} />
              <FormField label={`Link ${i + 1} URL`} name="navHref" defaultValue={item.href} />
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4 border-t border-border/50 pt-8">
        <h2 className="text-sm font-semibold">Social</h2>
        <p className="text-sm text-muted-foreground">
          Titles and URLs shown in the footer. Add, edit, or remove links per locale.
        </p>
        <SocialFieldsEditor items={site.social} />
      </section>
    </>
  );
}
