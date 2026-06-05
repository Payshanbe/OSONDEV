"use client";

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";

import type { ActionState } from "@/app/(admin)/admin/actions";
import { FormStatus, SubmitButton } from "@/components/admin/form-status";
import type { Locale } from "@/lib/i18n/config";

const initial: ActionState = { ok: true, message: "" };

type FormAction = (
  prev: ActionState | null,
  formData: FormData,
) => Promise<ActionState>;

interface AdminFormProps {
  action: FormAction;
  locale: Locale;
  children: React.ReactNode;
  submitLabel?: string;
}

function PendingSubmit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return <SubmitButton label={pending ? "Saving…" : label} />;
}

export function AdminForm({
  action,
  locale,
  children,
  submitLabel = "Save changes",
}: AdminFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, initial);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.replace(state.redirectTo);
    }
  }, [state, router]);

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="locale" value={locale} />
      {state.message ? <FormStatus state={state} /> : null}
      {children}
      <PendingSubmit label={submitLabel} />
    </form>
  );
}
