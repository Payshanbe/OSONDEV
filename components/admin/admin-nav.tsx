"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  Home,
  LayoutGrid,
  LogOut,
  Settings,
  Briefcase,
} from "lucide-react";

import { logoutAction } from "@/app/(admin)/admin/actions";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/admin", label: "Overview", icon: Home, exact: true },
  { href: "/admin/site", label: "Site settings", icon: Settings },
  { href: "/admin/sections", label: "Page sections", icon: LayoutGrid },
  { href: "/admin/work", label: "Work projects", icon: Briefcase },
] as const;

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {LINKS.map(({ href, label, icon: Icon, ...rest }) => {
        const exact = "exact" in rest && rest.exact;
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
              active
                ? "bg-secondary/80 text-foreground"
                : "text-muted-foreground hover:bg-secondary/40 hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0 opacity-70" aria-hidden />
            {label}
          </Link>
        );
      })}

      <a
        href="/"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
      >
        <FileText className="size-4 shrink-0 opacity-70" aria-hidden />
        View site
      </a>

      <form action={logoutAction} className="mt-2">
        <button
          type="submit"
          className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-secondary/40 hover:text-foreground"
        >
          <LogOut className="size-4 shrink-0 opacity-70" aria-hidden />
          Sign out
        </button>
      </form>
    </nav>
  );
}
