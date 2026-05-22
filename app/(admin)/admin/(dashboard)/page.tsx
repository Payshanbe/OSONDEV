import Link from "next/link";
import { ArrowRight } from "lucide-react";

const CARDS = [
  {
    href: "/admin/site",
    title: "Site settings",
    description: "Studio name, tagline, contact, navigation, and social links.",
  },
  {
    href: "/admin/sections",
    title: "Page sections",
    description: "Hero, services, process, marquee, CTA, and work intro copy.",
  },
  {
    href: "/admin/work",
    title: "Work projects",
    description: "Portfolio cards and case study pages.",
  },
] as const;

export default function AdminDashboardPage() {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
        Dashboard
      </p>
      <h1 className="mt-3 text-display-md font-medium tracking-tight">Content</h1>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
        Changes are saved per language to <code className="text-foreground/60">content/en</code> and{" "}
        <code className="text-foreground/60">content/ru</code>. No database required.
      </p>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2">
        {CARDS.map((card) => (
          <li key={card.href}>
            <Link
              href={card.href}
              className="group flex h-full flex-col rounded-2xl border border-border/60 bg-secondary/20 p-6 transition-colors hover:border-border hover:bg-secondary/35"
            >
              <h2 className="text-lg font-semibold tracking-tight">{card.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {card.description}
              </p>
              <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-foreground/80 transition-transform group-hover:translate-x-0.5">
                Open
                <ArrowRight className="size-3.5" aria-hidden />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      <p className="mt-12 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground/70">
        Public URLs: <code className="text-foreground/60">/en</code> and{" "}
        <code className="text-foreground/60">/ru</code>
      </p>
    </div>
  );
}
