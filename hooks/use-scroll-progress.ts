"use client";

import { useEffect, useState } from "react";

import { getLenis, onLenisReady, subscribeScroll } from "@/lib/lenis";

/**
 * Normalized scroll progress (0–1) for scroll-driven animations.
 * Reads `lenis.progress` when smooth scroll is active; otherwise derives
 * from native scroll metrics.
 */
export function useScrollProgress(): number {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const update = () => {
      const lenis = getLenis();
      if (lenis) {
        setProgress(lenis.progress);
        return;
      }

      const limit =
        document.documentElement.scrollHeight - window.innerHeight;
      setProgress(limit > 0 ? window.scrollY / limit : 0);
    };

    const attach = () => {
      cleanup?.();
      update();

      const lenis = getLenis();
      if (lenis) {
        cleanup = subscribeScroll(() => update());
        return;
      }

      let ticking = false;
      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            update();
            ticking = false;
          });
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    };

    attach();
    const unsubReady = onLenisReady(attach);

    return () => {
      cleanup?.();
      unsubReady();
    };
  }, []);

  return progress;
}
