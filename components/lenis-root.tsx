"use client";

import { useEffect } from "react";

import { destroyLenis, initLenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface LenisRootProps {
  children: React.ReactNode;
}

/**
 * Marketing-only Lenis host. Initializes smooth scroll on mount and
 * destroys on unmount. Falls back to native scroll when the user prefers
 * reduced motion.
 */
export function LenisRoot({ children }: LenisRootProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      destroyLenis();
      return;
    }

    initLenis();

    return () => {
      destroyLenis();
    };
  }, [prefersReducedMotion]);

  return children;
}
