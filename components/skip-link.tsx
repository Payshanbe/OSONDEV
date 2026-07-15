"use client";

import { usePathname } from "next/navigation";

export function SkipLink() {
  const pathname = usePathname();
  const label = pathname?.startsWith("/ru") ? "Перейти к содержимому" : "Skip to content";

  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:text-background"
    >
      {label}
    </a>
  );
}
