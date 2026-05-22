import Lenis, { type LenisOptions, type ScrollToOptions } from "lenis";

type ScrollListener = (scroll: number) => void;
type ReadyListener = () => void;

let instance: Lenis | null = null;
let rafId: number | null = null;
let enabled = false;

const scrollListeners = new Set<ScrollListener>();
const readyListeners = new Set<ReadyListener>();

const DEFAULT_OPTIONS: LenisOptions = {
  lerp: 0.08,
  duration: 1.1,
  smoothWheel: true,
  wheelMultiplier: 0.9,
  touchMultiplier: 1.1,
  autoResize: true,
  anchors: {
    offset: -80,
    duration: 1.1,
  },
};

function notifyReady() {
  readyListeners.forEach((cb) => cb());
}

function emitScroll(scroll: number) {
  scrollListeners.forEach((cb) => cb(scroll));
}

function startRafLoop() {
  if (rafId !== null || !instance) return;

  const loop = (time: number) => {
    if (!instance) {
      rafId = null;
      return;
    }
    instance.raf(time);
    rafId = requestAnimationFrame(loop);
  };

  rafId = requestAnimationFrame(loop);
}

function stopRafLoop() {
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
}

/**
 * Create the singleton Lenis instance. No-op on the server.
 * Returns the existing instance if already initialized.
 */
export function initLenis(options?: LenisOptions): Lenis | null {
  if (typeof window === "undefined") return null;
  if (instance) return instance;

  instance = new Lenis({ ...DEFAULT_OPTIONS, ...options });

  instance.on("scroll", (lenis) => {
    emitScroll(lenis.scroll);
  });

  enabled = true;
  startRafLoop();
  emitScroll(instance.scroll);
  notifyReady();

  return instance;
}

/**
 * Tear down Lenis and the RAF loop. Safe to call when not initialized.
 */
export function destroyLenis(): void {
  stopRafLoop();

  if (instance) {
    instance.destroy();
    instance = null;
  }

  enabled = false;
  notifyReady();
}

/** Access the live Lenis instance (null when disabled or not yet mounted). */
export function getLenis(): Lenis | null {
  return instance;
}

/** Whether smooth scrolling is currently active. */
export function isLenisEnabled(): boolean {
  return enabled && instance !== null;
}

/** Subscribe to scroll position updates (Lenis or native fallback from hooks). */
export function subscribeScroll(listener: ScrollListener): () => void {
  scrollListeners.add(listener);
  if (instance) listener(instance.scroll);
  return () => scrollListeners.delete(listener);
}

/** Fires immediately if Lenis is ready; otherwise on the next init. */
export function onLenisReady(listener: ReadyListener): () => void {
  if (instance) listener();
  readyListeners.add(listener);
  return () => readyListeners.delete(listener);
}

/**
 * Scroll to a target. Uses Lenis when enabled; falls back to native behavior.
 */
export function scrollToTarget(
  target: number | string | HTMLElement,
  options?: ScrollToOptions,
): void {
  if (typeof window === "undefined") return;

  if (instance && enabled) {
    instance.scrollTo(target, options);
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "auto" });
    return;
  }

  const el =
    typeof target === "string"
      ? document.querySelector(target)
      : target;

  if (el instanceof HTMLElement) {
    el.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

export type { Lenis, LenisOptions, ScrollToOptions };
