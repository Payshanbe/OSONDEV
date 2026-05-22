import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          404 · Page not found
        </p>
        <h1 className="mt-6 text-display-lg font-medium text-balance text-gradient">
          This page hasn't been{" "}
          <span className="font-serif italic font-normal">drafted</span> yet.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          The URL you followed doesn't exist — or hasn't been built. Head back
          to the studio and we'll point you in the right direction.
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href="/">Return to the studio</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
