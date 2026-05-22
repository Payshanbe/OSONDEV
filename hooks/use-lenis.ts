"use client";

import { useEffect, useState } from "react";

import { getLenis, isLenisEnabled, onLenisReady, type Lenis } from "@/lib/lenis";
import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

interface UseLenisReturn {
  /** Live Lenis instance, or `null` when reduced-motion / not mounted. */
  lenis: Lenis | null;
  /** True when Lenis smooth scroll is active. */
  enabled: boolean;
}

/**
 * Client-only access to the shared Lenis instance.
 *
 * Re-syncs when the provider mounts, destroys, or the user toggles
 * `prefers-reduced-motion` — never creates a second instance.
 */
export function useLenis(): UseLenisReturn {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      setLenis(null);
      setEnabled(false);
      return;
    }

    const sync = () => {
      setLenis(getLenis());
      setEnabled(isLenisEnabled());
    };

    sync();
    return onLenisReady(sync);
  }, [prefersReducedMotion]);

  return { lenis, enabled };
}
