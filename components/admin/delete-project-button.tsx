"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { deleteWorkProjectAction } from "@/app/(admin)/admin/actions";

import type { Locale } from "@/lib/i18n/config";

export function DeleteProjectButton({ slug, locale }: { slug: string; locale: Locale }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (!confirm(`Delete project "${slug}"? This cannot be undone.`)) return;
        startTransition(async () => {
          const result = await deleteWorkProjectAction(slug, locale);
          if (result.ok) router.push(`/admin/work?locale=${locale}`);
          else alert(result.message);
        });
      }}
      className="text-sm text-red-400/90 transition-colors hover:text-red-300 disabled:opacity-50"
    >
      {pending ? "Deleting…" : "Delete project"}
    </button>
  );
}
