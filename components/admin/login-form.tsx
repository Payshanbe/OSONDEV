"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { loginAction, type LoginState } from "@/app/(admin)/admin/actions";
import { FormField } from "@/components/admin/form-field";
import { FormStatus, SubmitButton } from "@/components/admin/form-status";

const initial: LoginState = { ok: true, message: "" };

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAction, initial);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <input type="hidden" name="from" value={redirectTo ?? "/admin"} />
      {state.message && !state.ok ? <FormStatus state={state} /> : null}
      <FormField
        label="Password"
        name="password"
        type="password"
        hint="On Vercel use ADMIN_PASSWORD from project settings, not .env.local."
      />
      <fieldset disabled={isPending}>
        <SubmitButton label={isPending ? "Signing in…" : "Sign in"} />
      </fieldset>
    </form>
  );
}
