"use client";

import Link from "next/link";

import { Logo } from "@/components/logo";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { localizeHref } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

const FOOTER_NAV = [
  { label: "Work", href: "/#work" },
  { label: "Services", href: "/#services" },
  { label: "Process", href: "/#process" },
] as const;

export function SiteFooter() {
  const { site } = useSiteContent();
  const locale = useLocale();
  const year = new Date().getFullYear();

  const social = [
    { label: "Twitter", href: site.social.twitter },
    { label: "GitHub", href: site.social.github },
    { label: "Dribbble", href: site.social.dribbble },
    { label: "LinkedIn", href: site.social.linkedin },
  ];

  return (
    <footer className="relative border-t border-border/40">
      <div className="container-wide py-16 sm:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <Logo size="lg" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {site.description}
            </p>
          </div>

          <div className="sm:col-span-1 lg:col-span-3 lg:col-start-6">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              Explore
            </p>
            <ul className="mt-5 space-y-3">
              {FOOTER_NAV.map((item) => (
                <li key={item.href}>
                  <FooterLink href={localizeHref(item.href, locale)}>{item.label}</FooterLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:col-span-1 lg:col-span-4">
            <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              Contact
            </p>
            <ul className="mt-5 space-y-3">
              <li>
                <FooterLink href={`mailto:${site.email}`}>{site.email}</FooterLink>
              </li>
            </ul>
            <p className="mt-8 font-mono text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
              Social
            </p>
            <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {social.map((item) => (
                <li key={item.href}>
                  <FooterLink href={item.href} external>
                    {item.label}
                  </FooterLink>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-border/40 pt-8 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="font-mono uppercase tracking-[0.18em]">
            © {year} {site.name} Dev
          </p>
          <p className="font-mono uppercase tracking-[0.18em] text-muted-foreground/70">
            Built with care
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
  external,
  className,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={cn(
        "group relative inline-block text-sm text-foreground/80 transition-colors duration-300 hover:text-foreground",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="absolute -bottom-px left-0 h-px w-full origin-left scale-x-0 bg-foreground/60 transition-transform duration-300 ease-out group-hover:scale-x-100"
      />
    </Link>
  );
}
