"use client";

import { MotionConfig } from "framer-motion";

import { baseDuration, easeOutExpo } from "@/lib/motion";

interface MotionProviderProps {
  children: React.ReactNode;
}

/**
 * App-wide motion configuration. Mount once near the top of the tree.
 *
 * What it does
 * ------------
 *
 *  1. `reducedMotion="user"` tells Framer Motion to honour the OS-level
 *     `prefers-reduced-motion` setting. When the user prefers reduced
 *     motion, transform-based animations (x, y, scale, rotate, skew) are
 *     skipped — values jump straight to their final target. Opacity still
 *     animates, so entrances remain perceptible without any movement.
 *
 *     This means consumers can keep using the same variants (`fadeUp`,
 *     `scaleSoft`, etc.) without any per-component reduced-motion code.
 *     No layout shifts, no conditional logic, no duplicated variants.
 *
 *  2. The default `transition` is the one place the studio curve and base
 *     duration are wired in, so motion that omits an explicit transition
 *     (one-off `animate` props, hover/tap targets, etc.) still moves on
 *     the same cadence as the rest of the site.
 */
export function MotionProvider({ children }: MotionProviderProps) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: baseDuration, ease: easeOutExpo }}
    >
      {children}
    </MotionConfig>
  );
}
