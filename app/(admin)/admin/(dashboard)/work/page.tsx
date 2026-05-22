import Link from "next/link";
import { Plus } from "lucide-react";

import { AdminLocaleTabs } from "@/components/admin/locale-tabs";
import { readWorkContent } from "@/lib/content/storage";
import { resolveAdminLocale } from "@/lib/admin/resolve-locale";

export default async function AdminWorkListPage({
  searchParams,
}: {
  searchParams: Promise<{ locale?: string }>;
}) {
  const { locale: localeParam } = await searchParams;
  const locale = resolveAdminLocale(localeParam);
  const { projects } = await readWorkContent(locale);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            Portfolio
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight">Work projects</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Case studies on the homepage grid and at{" "}
            <code className="text-foreground/70">/work/[slug]</code>.
          </p>
        </div>
        <Link
          href={`/admin/work/new?locale=${locale}`}
          className="inline-flex h-10 items-center gap-2 rounded-full border border-border/70 px-4 text-sm font-medium transition-colors hover:bg-secondary/50"
        >
          <Plus className="size-4" aria-hidden />
          New project
        </Link>
      </div>

      <AdminLocaleTabs basePath="/admin/work" activeLocale={locale} />

      <ul className="mt-10 divide-y divide-border/50 rounded-2xl border border-border/60">
        {projects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/admin/work/${project.slug}?locale=${locale}`}
              className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 transition-colors hover:bg-secondary/25"
            >
              <div>
                <p className="font-semibold">{project.title}</p>
                <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {project.category} · {project.year} · {project.slug}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">Edit →</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
