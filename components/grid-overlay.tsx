import { cn } from "@/lib/utils";

interface GridOverlayProps {
  className?: string;
}

/**
 * Layer 3 — masked grid.
 *
 * Implies scale and structure without reading as a "tech grid" graphic.
 * Radial mask keeps lines strongest near the hero focal point and fades
 * toward the edges so lower sections stay calm.
 */
export function GridOverlay({ className }: GridOverlayProps) {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 bg-grid opacity-[0.14]",
        className,
      )}
    />
  );
}
