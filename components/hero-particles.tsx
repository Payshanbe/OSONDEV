"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import { cn } from "@/lib/utils";

/** Согласовано с Tailwind `md` (768px): ниже — «мобильный» режим для интенсивности */
const MOBILE_MAX_WIDTH_MQ = "(max-width: 767px)";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface HeroParticlesProps {
  className?: string;
  /** 0–1 — общая яркость сетки и точек (на ширине ≥ md) */
  intensity?: number;
  /**
   * На узких экранах (`max-width: 767px`) к `intensity` применяется этот множитель.
   * По умолчанию сетка заметно тише, чем на десктопе.
   */
  mobileIntensityScale?: number;
}

/**
 * Canvas-частицы в стиле particles.js default preset для фона Hero:
 * точки + линии между соседями, лёгкий repulse от курсора.
 * pointer-events-none — клики проходят к кнопкам и ссылкам.
 * На узких экранах яркость сетки снижается (`mobileIntensityScale`).
 */
export function HeroParticles({
  className,
  intensity = 0.9,
  mobileIntensityScale = 0.48,
}: HeroParticlesProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const intensityRef = useRef(intensity);
  intensityRef.current = intensity;
  /** 1 на десктопе, `mobileIntensityScale` на мобильных — читается в RAF */
  const viewportIntensityFactorRef = useRef(1);

  useLayoutEffect(() => {
    const mq = window.matchMedia(MOBILE_MAX_WIDTH_MQ);
    const apply = () => {
      viewportIntensityFactorRef.current = mq.matches ? mobileIntensityScale : 1;
    };
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, [mobileIntensityScale]);

  useEffect(() => {
    if (prefersReducedMotion) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = ctx;

    let raf = 0;
    let particles: Particle[] = [];
    let w = 0;
    let h = 0;
    let dpr = 1;

    const linkDistance = 152;
    const linkDistanceSq = linkDistance * linkDistance;
    const repulseRadius = 100;
    const repulseRadiusSq = repulseRadius * repulseRadius;

    function countForArea(area: number) {
      return Math.min(160, Math.max(52, Math.floor(area / 3000)));
    }

    function initParticles() {
      const area = w * h;
      const n = countForArea(area);
      particles = [];
      for (let i = 0; i < n; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.28,
          vy: (Math.random() - 0.5) * 0.28,
        });
      }
    }

    function resize() {
      const el = containerRef.current;
      const c = canvasRef.current;
      if (!el || !c) return;
      const rect = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.floor(rect.width));
      h = Math.max(1, Math.floor(rect.height));
      c.width = Math.floor(w * dpr);
      c.height = Math.floor(h * dpr);
      c.style.width = `${w}px`;
      c.style.height = `${h}px`;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      initParticles();
    }

    const ro = new ResizeObserver(() => resize());
    ro.observe(container);
    resize();

    const syncMouse = (e: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;
      if (inside) {
        mouseRef.current = { x, y, active: true };
      } else {
        mouseRef.current = { x: -1000, y: -1000, active: false };
      }
    };

    window.addEventListener("pointermove", syncMouse, { passive: true });

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const k = Math.max(
        0.2,
        Math.min(1, intensityRef.current * viewportIntensityFactorRef.current),
      );

      g.clearRect(0, 0, w, h);

      for (const p of particles) {
        if (mouseRef.current.active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq > 4 && distSq < repulseRadiusSq) {
            const dist = Math.sqrt(distSq);
            const force = (repulseRadius - dist) / repulseRadius;
            p.vx += (dx / dist) * force * 0.06;
            p.vy += (dy / dist) * force * 0.06;
          }
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.988;
        p.vy *= 0.988;

        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
        p.x = Math.max(0, Math.min(w, p.x));
        p.y = Math.max(0, Math.min(h, p.y));
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i]!;
          const b = particles[j]!;
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < linkDistanceSq) {
            const t = 1 - dSq / linkDistanceSq;
            const alpha = t * t * 0.52 * k;
            g.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
            g.lineWidth = 1.15;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
      }

      g.fillStyle = `rgba(255, 255, 255, ${0.5 * k})`;
      for (const p of particles) {
        g.beginPath();
        g.arc(p.x, p.y, 1.35, 0, Math.PI * 2);
        g.fill();
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", syncMouse);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 z-[1] overflow-hidden",
        className,
      )}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
