"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

import { FormField } from "@/components/admin/form-field";
import type { SocialLink } from "@/lib/content/types";

interface SocialFieldsEditorProps {
  items: SocialLink[];
}

export function SocialFieldsEditor({ items }: SocialFieldsEditorProps) {
  const [rows, setRows] = useState<SocialLink[]>(
    items.length > 0 ? items : [{ label: "", href: "" }],
  );

  const addRow = () => setRows((prev) => [...prev, { label: "", href: "" }]);

  const removeRow = (index: number) => {
    setRows((prev) => {
      const next = prev.filter((_, i) => i !== index);
      return next.length > 0 ? next : [{ label: "", href: "" }];
    });
  };

  return (
    <div className="space-y-4">
      <ul className="space-y-4">
        {rows.map((row, index) => (
          <li
            key={index}
            className="rounded-lg border border-border/50 bg-secondary/20 p-4"
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Link {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeRow(index)}
                className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-red-400/90 transition-colors hover:bg-red-500/10 hover:text-red-300"
                aria-label={`Remove social link ${index + 1}`}
              >
                <Trash2 className="size-3.5" aria-hidden />
                Remove
              </button>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Title" name="socialLabel" defaultValue={row.label} />
              <FormField label="URL" name="socialHref" defaultValue={row.href} type="url" />
            </div>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={addRow}
        className="inline-flex items-center gap-2 rounded-lg border border-dashed border-border/70 px-3 py-2 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
      >
        <Plus className="size-4" aria-hidden />
        Add social link
      </button>
      <p className="text-xs text-muted-foreground/80">
        Empty rows are ignored on save. Remove a link with the button above or clear both fields.
      </p>
    </div>
  );
}
