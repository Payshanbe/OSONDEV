import type { Metadata } from "next";

import { buildMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Admin",
  path: "/admin",
  noIndex: true,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground">
      <header className="border-b border-border/60">
        <div className="container-wide flex h-14 items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Sitan · Admin
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground/70">
            Content CMS
          </p>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
