import Link from "next/link";

import { LoginForm } from "@/components/admin/login-form";
import { buildMetadata } from "@/lib/metadata";
import { getAdminPasswordLength, isAdminPasswordConfigured } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "Sign in",
  path: "/admin/login",
  noIndex: true,
});

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;
  const passwordConfigured = isAdminPasswordConfigured();
  const passwordLength = getAdminPasswordLength();

  return (
    <div className="container-wide flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center py-16">
      <div className="w-full max-w-sm">
        <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
          Admin
        </p>
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Edit site copy, sections, and portfolio projects.
        </p>

        <div
          className="mt-4 rounded-lg border border-border/60 bg-secondary/30 px-3 py-2.5 text-xs text-muted-foreground"
          role="status"
        >
          {passwordConfigured ? (
            <p>
              Server password is configured ({passwordLength} characters). Use the same value as{" "}
              <code className="text-foreground/90">ADMIN_PASSWORD</code> on Vercel — not{" "}
              <code className="text-foreground/90">.env.local</code>.
            </p>
          ) : (
            <p>
              Server password is <strong className="text-foreground">not configured</strong>. Add{" "}
              <code className="text-foreground/90">ADMIN_PASSWORD</code> in Vercel → Environment
              Variables, enable Production, then Redeploy.
            </p>
          )}
        </div>

        <LoginForm redirectTo={from} />
        <p className="mt-8 text-center text-xs text-muted-foreground">
          <Link href="/" className="underline-offset-4 hover:underline">
            Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
