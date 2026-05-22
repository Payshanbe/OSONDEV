"use client";

import * as React from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

interface MagneticProps {
  children: React.ReactNode;
  /** Pull strength toward cursor — keep low for restraint */
  strength?: number;
  /** Max displacement in px */
  max?: number;
  className?: string;
}

/**
 * Subtle magnetic pull toward the pointer — use on primary CTAs only.
 * Disabled when reduced motion or coarse pointer is preferred.
 */
export function Magnetic({
  children,
  strength = 0.35,
  max = 10,
  className,
}: MagneticProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (prefersReducedMotion) return;

    const mqFine = window.matchMedia("(pointer: fine)");
    const mqWide = window.matchMedia("(min-width: 1024px)");

    const el = ref.current;
    if (!el) return;

    let active = mqFine.matches && mqWide.matches;

    const apply = (nx: number, ny: number, transition: boolean) => {
      el.style.transition = transition
        ? "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)"
        : "none";
      el.style.transform =
        nx === 0 && ny === 0
          ? ""
          : `translate3d(${nx}px, ${ny}px, 0)`;
    };

    const move = (e: MouseEvent) => {
      if (!active) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const nx = Math.max(-max, Math.min(max, dx * strength * 0.12));
      const ny = Math.max(-max, Math.min(max, dy * strength * 0.12));
      apply(nx, ny, false);
    };

    const leave = () => {
      apply(0, 0, true);
    };

    const syncMq = () => {
      active = mqFine.matches && mqWide.matches;
      if (!active) leave();
    };

    el.addEventListener("mousemove", move);
    el.addEventListener("mouseleave", leave);
    mqFine.addEventListener("change", syncMq);
    mqWide.addEventListener("change", syncMq);

    return () => {
      el.removeEventListener("mousemove", move);
      el.removeEventListener("mouseleave", leave);
      mqFine.removeEventListener("change", syncMq);
      mqWide.removeEventListener("change", syncMq);
      el.style.transform = "";
      el.style.transition = "";
    };
  }, [prefersReducedMotion, strength, max]);

  return (
    <div
      ref={ref}
      data-magnetic=""
      className={cn("inline-flex will-change-transform", className)}
    >
      {children}
    </div>
  );
}
