import type { Variants } from "framer-motion";

import {
  blurIn,
  easeOutExpo,
  fadeIn,
  fadeUp,
  scaleSoft,
  staggerContainer,
} from "@/lib/motion";

export type RevealVariant = "fade-up" | "fade-in" | "scale-soft" | "blur-in";

export interface RevealTransitionOptions {
  delay?: number;
  duration?: number;
  y?: number;
}

const VARIANT_MAP = {
  "fade-up": fadeUp,
  "fade-in": fadeIn,
  "scale-soft": scaleSoft,
  "blur-in": blurIn,
} as const;

const DEFAULT_DURATION: Record<RevealVariant, number> = {
  "fade-up": 0.7,
  "fade-in": 0.6,
  "scale-soft": 0.6,
  "blur-in": 0.8,
};

/**
 * Build item-level variants with optional delay, duration, and y offset.
 * Used by `Reveal` and `Reveal.Item`.
 */
export function getRevealVariants(
  variant: RevealVariant = "fade-up",
  { delay = 0, duration, y = 16 }: RevealTransitionOptions = {},
): Variants {
  const base = VARIANT_MAP[variant];
  const resolvedDuration = duration ?? DEFAULT_DURATION[variant];

  if (variant === "fade-up") {
    return {
      hidden: { opacity: 0, y },
      visible: {
        opacity: 1,
        y: 0,
        transition: { duration: resolvedDuration, delay, ease: easeOutExpo },
      },
    };
  }

  const visible = base.visible ?? { opacity: 1 };
  const baseTransition =
    typeof visible === "object" && visible !== null && "transition" in visible
      ? (visible.transition as Record<string, unknown>)
      : {};

  return {
    hidden: base.hidden ?? { opacity: 0 },
    visible: {
      ...(typeof visible === "object" ? visible : {}),
      transition: {
        ...baseTransition,
        duration: resolvedDuration,
        delay,
        ease: easeOutExpo,
      },
    },
  };
}

export { staggerContainer };

/** Default viewport — triggers once, slightly before element is centered */
export const REVEAL_VIEWPORT = {
  once: true,
  margin: "0px 0px -10% 0px",
  amount: 0.15,
} as const;
