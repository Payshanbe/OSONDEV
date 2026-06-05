import Link from "next/link";
import { notFound } from "next/navigation";

import { saveWorkProjectAction } from "@/app/(admin)/admin/actions";
import { AdminForm } from "@/components/admin/admin-form";
import { DeleteProjectButton } from "@/components/admin/delete-project-button";
import { GalleryMediaField } from "@/components/admin/gallery-media-field";
import { FormField } from "@/components/admin/form-field";
import { isBlobStorageEnabled } from "@/lib/blob";
import { AdminLocaleTabs } from "@/components/admin/locale-tabs";
import { getWorkProject } from "@/lib/content";
import type { WorkProject } from "@/lib/content/types";
import { resolveAdminLocale } from "@/lib/admin/resolve-locale";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ locale?: string }>;
};

export default async function AdminWorkEditPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { locale: localeParam } = await searchParams;
  const locale = resolveAdminLocale(localeParam);
  const isNew = slug === "new";

  const project: WorkProject | undefined = isNew
    ? {
        slug: "",
        title: "",
        category: "",
        year: new Date().getFullYear().toString(),
        description: "",
        stack: [],
        accent: "hsl(240 25% 12%)",
        glow: "hsl(280 65% 55% / 0.25)",
        body: "",
        gallery: [],
      }
    : await getWorkProject(slug, locale);

  if (!project && !isNew) notFound();

  const p = project!;

  return (
    <div>
      <Link
        href={`/admin/work?locale=${locale}`}
        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        ← All projects
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">
        {isNew ? "New project" : p.title}
      </h1>

      <AdminLocaleTabs basePath={`/admin/work/${slug}`} activeLocale={locale} />

      {!isBlobStorageEnabled() ? (
        <p className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100/90">
          Cover uploads need{" "}
          <code className="text-amber-50">BLOB_READ_WRITE_TOKEN</code> — create a Blob store in
          Vercel → Storage, connect to this project, then redeploy.
        </p>
      ) : null}

      <div className="mt-10">
        <AdminForm action={saveWorkProjectAction} locale={locale}>
          {!isNew ? <input type="hidden" name="originalSlug" value={slug} /> : null}
          <FormField
            label="Slug (URL)"
            name="slug"
            defaultValue={p.slug}
            readOnly={!isNew}
            hint={
              isNew
                ? "Lowercase, hyphens — e.g. atlas-metrics. Set before uploading a cover."
                : "Slug is fixed after creation. Create a new project to use a different URL."
            }
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField label="Title" name="title" defaultValue={p.title} />
            <FormField label="Category" name="category" defaultValue={p.category} />
            <FormField label="Year" name="year" defaultValue={p.year} />
          </div>
          <GalleryMediaField project={p} slug={isNew ? "" : p.slug} />

          <FormField
            label="Short description"
            name="description"
            defaultValue={p.description}
            multiline
          />
          <FormField
            label="Stack (comma-separated)"
            name="stack"
            defaultValue={p.stack.join(", ")}
          />
          <FormField label="Accent color (CSS)" name="accent" defaultValue={p.accent} />
          <FormField label="Glow color (CSS)" name="glow" defaultValue={p.glow} />
          <FormField
            label="Case study body"
            name="body"
            defaultValue={p.body ?? ""}
            multiline
            rows={6}
          />
        </AdminForm>
      </div>

      {!isNew && p.slug ? (
        <div className="mt-8 border-t border-border/50 pt-8">
          <DeleteProjectButton slug={p.slug} locale={locale} />
        </div>
      ) : null}
    </div>
  );
}
