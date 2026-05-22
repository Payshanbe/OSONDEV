import type { Variants } from "framer-motion";

/* -------------------------------------------------------------------------- */
/*                                  Tokens                                    */
/* -------------------------------------------------------------------------- */

/**
 * The studio's single motion easing curve — a long out-quint.
 *
 * Every variant below references it so the entire site shares one cadence.
 * It's also handed to `MotionConfig` as the global default, so even ad-hoc
 * `animate` props that omit a transition still land on the same curve.
 */
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

/**
 * Default duration. Sits in the 0.4–0.9s window — long enough to feel
 * composed, short enough to stay responsive.
 */
export const baseDuration = 0.7;

/* -------------------------------------------------------------------------- */
/*                                 Variants                                   */
/* -------------------------------------------------------------------------- */

/**
 * Rise into place. The everyday entrance for headlines, paragraphs, cards,
 * and CTAs.
 *
 * The `y` offset is intentionally small (16px) so that when `MotionConfig`
 * strips transforms for reduced-motion users, the resulting opacity-only
 * transition never introduces visible layout shift.
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: baseDuration, ease: easeOutExpo },
  },
};

/**
 * Pure crossfade — for ambient layers, dividers, and chrome where any
 * vertical motion would feel louder than a gentle opacity transition.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/**
 * Orchestration variant. Drop it on any parent and its motion descendants
 * will reveal in sequence — children stay declarative and reusable.
 *
 * Pair with `fadeUp`, `fadeIn`, `scaleSoft`, or `blurIn` on each child.
 */
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.09,
      delayChildren: 0.08,
    },
  },
};

/**
 * Subtle scale-up — used for cards, media, badges, and tiles. The scale
 * delta is intentionally tiny (0.98 → 1) so reduced-motion users barely
 * notice anything is missing when the transform is dropped.
 */
export const scaleSoft: Variants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

/**
 * Cinematic "focus pull" — fades up from a soft blur.
 *
 * Reserved for heavyweight single elements (hero media, feature cards,
 * marquee art). Avoid on body paragraphs — filter animations are
 * GPU-intensive at scale.
 */
export const blurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};
