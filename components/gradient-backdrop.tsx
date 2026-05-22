import { auroraBlobs } from "@/lib/background";
import { cn } from "@/lib/utils";

interface GradientBackdropProps {
  className?: string;
}

/**
 * Layer 2 — animated aurora field.
 *
 * Slow CSS-only motion (compositor-friendly transforms). Each blob drifts on
 * its own period so the parallax never reads as a single loop. Palette is
 * restrained: violet, blue, cyan, and a faint white wash — no neon, no rose.
 *
 * Server component: zero client JS, zero re-renders on scroll.
 */
export function GradientBackdrop({ className }: GradientBackdropProps) {
  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      {auroraBlobs.map((blob) => (
        <div
          key={blob.id}
          className={cn(
            "absolute rounded-full blur-3xl will-change-transform",
            blob.position,
            blob.className,
          )}
          style={{
            ...blob.style,
            animation: blob.animation,
          }}
        />
      ))}

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent" />
      <div className="absolute inset-x-[10%] bottom-[12%] h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
    </div>
  );
}
