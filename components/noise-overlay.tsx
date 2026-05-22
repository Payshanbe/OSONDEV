import { cn } from "@/lib/utils";

interface NoiseOverlayProps {
  className?: string;
  /** Opacity between 0.05 and 0.10 — default 0.07 */
  opacity?: number;
}

/**
 * Tiled fractal-noise texture (128×128). A single small tile repeats across
 * the viewport instead of running an SVG filter over the full screen, which
 * keeps paint cost predictable on scroll.
 *
 * Layer 4 in the global stack — mounted in the root layout above the
 * background shell, below page content.
 */
const NOISE_TILE = encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
    <filter id="n">
      <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch"/>
    </filter>
    <rect width="100%" height="100%" filter="url(#n)" opacity="0.55"/>
  </svg>`,
);

/**
 * Layer 4 — film grain.
 *
 * Sits above the aurora/grid shell and below interactive content. Uses
 * `mix-blend-soft-light` so the grain reads as texture, not a grey wash.
 * Server component — static markup, no hydration cost.
 */
export function NoiseOverlay({ className, opacity = 0.07 }: NoiseOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-[1] bg-repeat mix-blend-soft-light",
        className,
      )}
      style={{
        opacity,
        backgroundImage: `url("data:image/svg+xml,${NOISE_TILE}")`,
        backgroundSize: "128px 128px",
      }}
    />
  );
}
