"use client";

import { useEffect, useState } from "react";

import { getLenis, onLenisReady, subscribeScroll } from "@/lib/lenis";

interface UseScrollOptions {
  /** Pixel threshold before `scrolled` flips to true. */
  threshold?: number;
}

/**
 * Header scroll state — works with Lenis and native scroll.
 *
 * Subscribes to the Lenis scroll emitter when active; otherwise listens
 * to `window` scroll via rAF coalescing. Only re-renders when crossing
 * the threshold.
 */
export function useScroll({ threshold = 16 }: UseScrollOptions = {}) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    const setFromScroll = (y: number) => {
      const next = y > threshold;
      setScrolled((prev) => (prev === next ? prev : next));
    };

    const attach = () => {
      cleanup?.();

      const lenis = getLenis();
      if (lenis) {
        setFromScroll(lenis.scroll);
        cleanup = subscribeScroll(setFromScroll);
        return;
      }

      let ticking = false;
      const update = () => {
        setFromScroll(window.scrollY);
        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(update);
          ticking = true;
        }
      };

      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      cleanup = () => window.removeEventListener("scroll", onScroll);
    };

    attach();
    const unsubReady = onLenisReady(attach);

    return () => {
      cleanup?.();
      unsubReady();
    };
  }, [threshold]);

  return { scrolled };
}
