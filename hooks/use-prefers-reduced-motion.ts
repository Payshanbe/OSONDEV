"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  return false;
}

/**
 * SSR-safe subscription to the user's reduced-motion preference.
 *
 * Backed by React's `useSyncExternalStore`, which guarantees:
 *  - The server renders `false` (we can't read the user's prefs on the server).
 *  - The client computes the real value before paint, so the first frame
 *    on hydration is already correct — no flash of unreduced motion.
 *  - Subsequent changes (the user toggles the OS setting at runtime)
 *    propagate live without remounting consumers.
 *  - No hydration mismatch warnings, ever.
 *
 * Framer Motion's `MotionConfig reducedMotion="user"` handles transform
 * reduction automatically — reach for this hook when you need the same
 * signal for CSS-driven animations or other non-Framer code paths.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
