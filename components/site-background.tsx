import { GradientBackdrop } from "@/components/gradient-backdrop";
import { GridOverlay } from "@/components/grid-overlay";
import { cn } from "@/lib/utils";

interface SiteBackgroundProps {
  className?: string;
}

/**
 * Global cinematic background shell — fixed behind all page content.
 *
 * Layer stack (back → front):
 *  1. Base canvas     — `bg-background` (also on `<body>` for no-JS fallback)
 *  2. Aurora field    — `GradientBackdrop`
 *  3. Masked grid    — `GridOverlay`
 *  4. Vignette       — seats content into the canvas
 *
 * Noise and page content are siblings in the root layout:
 *  - `NoiseOverlay` sits above this shell, below interactive content
 *  - `{children}` render in a `relative z-10` wrapper
 *
 * Server component · `pointer-events-none` · `contain: strict` for paint isolation.
 */
export function SiteBackground({ className }: SiteBackgroundProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        "[contain:strict]",
        className,
      )}
    >
      <div className="absolute inset-0 bg-background" />
      <GradientBackdrop />
      <GridOverlay />
      <div className="absolute inset-0 vignette" />
    </div>
  );
}

