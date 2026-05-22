"use client";

import type { ActionState } from "@/app/(admin)/admin/actions";
import { cn } from "@/lib/utils";

export function FormStatus({ state }: { state: ActionState }) {
  if (!state.message) return null;
  return (
    <p
      role="status"
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        state.ok
          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
          : "border-red-500/30 bg-red-500/10 text-red-200",
      )}
    >
      {state.message}
    </p>
  );
}

export function SubmitButton({
  label = "Save changes",
}: {
  label?: string;
}) {
  return (
    <button
      type="submit"
      className={cn(
        "inline-flex h-10 items-center justify-center rounded-full px-5 text-sm font-medium",
        "bg-foreground text-background transition-opacity hover:opacity-90",
        "disabled:cursor-not-allowed disabled:opacity-50",
      )}
    >
      {label}
    </button>
  );
}
