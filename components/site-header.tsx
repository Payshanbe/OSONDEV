"use client";

import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";

import { Logo } from "@/components/logo";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { useScroll } from "@/hooks/use-scroll";
import { easeOutExpo } from "@/lib/motion";
import { LocaleSwitcher } from "@/components/locale-switcher";
import { useLocale, useSiteContent } from "@/components/site-content-provider";
import { localizeHref } from "@/lib/i18n/paths";
import { cn } from "@/lib/utils";

const BAR_TRANSITION = { duration: 0.45, ease: easeOutExpo } as const;

/** Sync with Tailwind `md` — inline nav visible, hamburger hidden */
const DESKTOP_NAV_MQ = "(min-width: 768px)";

/**
 * Studio navigation — transparent at rest, frosted glass on scroll.
 *
 * Layout: logo (left) · links (center, desktop) · locale + menu (right).
 * Mobile: menu trigger + slide-over panel. Scroll state is driven by a
 * rAF-coalesced hook that only re-renders when crossing the threshold.
 */
export function SiteHeader() {
  const { site } = useSiteContent();
  const locale = useLocale();
  const { scrolled } = useScroll({ threshold: 16 });
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const openMobile = useCallback(() => setMobileOpen(true), []);

  /** Close drawer when crossing desktop breakpoint (resize / rotate). */
  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_NAV_MQ);
    const onChange = () => {
      if (mq.matches) setMobileOpen(false);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50">
        <motion.div
          className="container-wide"
          initial={false}
          animate={{ paddingTop: scrolled ? 12 : 20 }}
          transition={BAR_TRANSITION}
        >
          <motion.div
            initial={false}
            animate={{
              backgroundColor: scrolled
                ? "hsla(240, 10%, 3.5%, 0.55)"
                : "hsla(240, 10%, 3.5%, 0)",
              borderColor: scrolled
                ? "hsla(240, 6%, 14%, 0.55)"
                : "hsla(240, 6%, 14%, 0)",
              boxShadow: scrolled
                ? "0 8px 32px -12px hsla(0, 0%, 0%, 0.55)"
                : "0 0 0 0 transparent",
            }}
            transition={BAR_TRANSITION}
            className={cn(
              "relative flex h-14 items-center justify-between gap-3 overflow-hidden rounded-full border px-4 sm:gap-4 sm:px-5",
              "md:grid md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:items-center md:justify-between md:gap-4",
              "transition-[backdrop-filter] duration-500 ease-out-expo",
              scrolled && "backdrop-blur-xl",
            )}
          >
            <div className="relative flex min-h-0 min-w-0 w-full flex-1 items-center justify-between gap-3 md:contents">
              <div className="min-w-0 shrink md:justify-self-start">
                <Logo className="min-w-0 max-w-[min(52vw,13rem)] sm:max-w-none" />
              </div>

            <nav
              aria-label="Primary"
              className="hidden items-center justify-center gap-6 md:flex lg:gap-8"
            >
              {site.nav.map((item) => (
                <NavLink key={item.href} href={localizeHref(item.href, locale)}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="flex shrink-0 items-center justify-end gap-2 md:justify-self-end">
              <LocaleSwitcher className="hidden sm:inline-flex" />

              <button
                type="button"
                onClick={openMobile}
                aria-expanded={mobileOpen}
                aria-controls="mobile-navigation"
                aria-label="Open menu"
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-secondary/50 hover:text-foreground focus-ring md:hidden"
              >
                <Menu className="size-[18px]" strokeWidth={1.75} aria-hidden />
              </button>
            </div>
            </div>
          </motion.div>
        </motion.div>
      </header>

      <MobileNav id="mobile-navigation" open={mobileOpen} onClose={closeMobile} />
    </>
  );
}
