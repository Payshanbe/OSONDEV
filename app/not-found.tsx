"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  const pathname = usePathname();
  const locale = pathname?.startsWith("/ru") ? "ru" : "en";
  const copy =
    locale === "ru"
      ? {
          label: "404 · Страница не найдена",
          title: "Такой страницы пока нет.",
          description:
            "Адрес неверен или страница была перемещена. Вернитесь на главную страницу студии.",
          action: "Вернуться на главную",
        }
      : {
          label: "404 · Page not found",
          title: "This page hasn't been drafted yet.",
          description:
            "The URL you followed doesn't exist or has moved. Return to the studio homepage.",
          action: "Return to the studio",
        };

  return (
    <main className="relative isolate flex min-h-screen items-center justify-center px-6">
      <div className="text-center">
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {copy.label}
        </p>
        <h1 className="text-gradient mt-6 text-balance text-display-lg font-medium">
          {copy.title}
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-relaxed text-muted-foreground">
          {copy.description}
        </p>
        <div className="mt-8 flex justify-center">
          <Button asChild size="lg">
            <Link href={`/${locale}`}>{copy.action}</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
