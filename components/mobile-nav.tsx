"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

import { NavLink } from "@/components/nav-link";
import { Button } from "@/components/ui/button";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { localizeHref } from "@/lib/i18n/paths";
import { easeOutExpo } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
  id?: string;
}

/**
 * Full-height slide-over menu for small viewports.
 * Locks body scroll while open; dismisses on Escape or backdrop tap.
 */
export function MobileNav({ open, onClose, id }: MobileNavProps) {
  const { site } = useSiteContent();
  const locale = useLocale();

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.button
            type="button"
            aria-label="Close menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: easeOutExpo }}
            className="fixed inset-0 z-[60] bg-background/40 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            id={id}
            role="dialog"
            aria-modal="true"
            aria-label="Navigation menu"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: easeOutExpo }}
            className={cn(
              "fixed inset-y-0 right-0 z-[70] flex w-full max-w-[min(100vw,24rem)] flex-col",
              "border-l border-border/50 bg-background/95 shadow-2xl backdrop-blur-xl",
              "overscroll-contain pt-[env(safe-area-inset-top)]",
              "pb-[env(safe-area-inset-bottom)]",
            )}
            data-lenis-prevent
          >
            <div className="flex h-14 min-h-[3.5rem] shrink-0 items-center justify-between border-b border-border/40 px-4 sm:h-16 sm:px-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                Menu
              </span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/60 hover:text-foreground focus-ring"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <nav
              className="flex flex-1 flex-col gap-0 overflow-y-auto px-4 py-6 sm:px-6"
              aria-label="Mobile"
            >
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.05 + i * 0.04,
                    duration: 0.4,
                    ease: easeOutExpo,
                  }}
                >
                  <NavLink
                    href={localizeHref(item.href, locale)}
                    onClick={onClose}
                    className="flex min-h-[48px] w-full items-center px-0 py-3 text-base font-medium tracking-tight sm:py-4"
                  >
                    {item.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>

            <div className="shrink-0 border-t border-border/40 p-4 sm:p-6">
              <LocaleSwitcher className="mb-4 w-full justify-center" />
              <Button
                asChild
                size="lg"
                className="w-full shadow-[0_0_0_1px_hsl(var(--accent)/0.35),0_12px_40px_-12px_hsl(var(--accent)/0.35)] transition-shadow duration-300 hover:shadow-[0_0_0_1px_hsl(var(--accent)/0.5),0_16px_48px_-10px_hsl(var(--accent)/0.45)]"
              >
                <Link href={localizeHref(site.cta.href, locale)} onClick={onClose}>
                  {site.cta.label}
                </Link>
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
