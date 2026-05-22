"use client";

import { useEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";

export const CURSOR_INTERACTIVE_SELECTOR =
  'a[href], button:not([disabled]), [role="button"], label[for], summary, input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [data-cursor-interactive]';

const IGNORE_SELECTOR = "[data-cursor-ignore]";

const DOT_LERP = 0.52;
const RING_LERP = 0.14;

/**
 * Desktop-only custom cursor: crisp dot + softly lagging ring.
 *
 * Updates DOM transforms inside requestAnimationFrame — no React state
 * during pointer moves. Disabled for coarse pointers and reduced motion.
 *
 * z-[65]: above chrome & grain; below mobile overlay/dialog (z-[70]+).
 */
export function Cursor() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const mqFine = window.matchMedia("(pointer: fine)");
    const mqWide = window.matchMedia("(min-width: 1024px)");
    const html = document.documentElement;

    const mouse = { x: 0, y: 0 };
    const dot = { x: 0, y: 0 };
    const ring = { x: 0, y: 0 };

    let interactive = false;
    let visible = false;
    let rafId = 0;

    const setHtmlCursor = (on: boolean) => {
      html.classList.toggle("cursor-none-marketing", on);
    };

    const hideLayers = () => {
      visible = false;
      const d = dotRef.current;
      const r = ringRef.current;
      if (d) d.style.opacity = "0";
      if (r) r.style.opacity = "0";
    };

    const setInteractiveFromPoint = (x: number, y: number) => {
      const el = document.elementFromPoint(x, y);
      if (!el || !(el instanceof Element)) {
        interactive = false;
        return;
      }
      const hit = el.closest(CURSOR_INTERACTIVE_SELECTOR);
      const ignored = el.closest(IGNORE_SELECTOR);
      interactive = !!hit && !ignored;
    };

    const tick = () => {
      const mx = mouse.x;
      const my = mouse.y;

      setInteractiveFromPoint(mx, my);

      dot.x += (mx - dot.x) * DOT_LERP;
      dot.y += (my - dot.y) * DOT_LERP;
      ring.x += (mx - ring.x) * RING_LERP;
      ring.y += (my - ring.y) * RING_LERP;

      const hover = interactive;
      const ringScale = hover ? 1.28 : 1;
      const ringAlpha = hover ? 0.52 : 0.28;
      const dotScale = hover ? 1.12 : 1;
      const dotAlpha = hover ? 1 : 0.88;

      const d = dotRef.current;
      const r = ringRef.current;

      if (d) {
        d.style.opacity = visible ? String(dotAlpha) : "0";
        d.style.transform = `translate3d(${dot.x}px, ${dot.y}px, 0) translate(-50%, -50%) scale(${dotScale})`;
      }
      if (r) {
        r.style.opacity = visible ? String(ringAlpha) : "0";
        r.style.transform = `translate3d(${ring.x}px, ${ring.y}px, 0) translate(-50%, -50%) scale(${ringScale})`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      cancelAnimationFrame(rafId);
      rafId = 0;
      hideLayers();
    };

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        dot.x = mouse.x;
        dot.y = mouse.y;
        ring.x = mouse.x;
        ring.y = mouse.y;
      }
    }

    function onPointerLeaveDoc(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      hideLayers();
    }

    let listenersBound = false;

    const bindListeners = () => {
      if (listenersBound) return;
      document.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeaveDoc);
      window.addEventListener("blur", hideLayers);
      listenersBound = true;
    };

    const unbindListeners = () => {
      if (!listenersBound) return;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeaveDoc);
      window.removeEventListener("blur", hideLayers);
      listenersBound = false;
    };

    const syncEnabled = () => {
      const enabled = mqFine.matches && mqWide.matches;
      setHtmlCursor(enabled);

      if (!enabled) {
        stopLoop();
        unbindListeners();
        return;
      }

      bindListeners();
      startLoop();
    };

    syncEnabled();

    mqFine.addEventListener("change", syncEnabled);
    mqWide.addEventListener("change", syncEnabled);

    return () => {
      mqFine.removeEventListener("change", syncEnabled);
      mqWide.removeEventListener("change", syncEnabled);
      unbindListeners();
      stopLoop();
      html.classList.remove("cursor-none-marketing");
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[65] hidden overflow-hidden lg:block"
      data-cursor-root
    >
      <div
        ref={ringRef}
        className="fixed left-0 top-0 h-10 w-10 rounded-full border border-foreground/35 will-change-transform"
        style={{ opacity: 0 }}
      />
      <div
        ref={dotRef}
        className="fixed left-0 top-0 h-1.5 w-1.5 rounded-full bg-foreground shadow-[0_0_12px_-2px_hsl(var(--foreground)/0.35)] will-change-transform"
        style={{ opacity: 0 }}
      />
    </div>
  );
}
