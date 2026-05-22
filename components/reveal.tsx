"use client";

import * as React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

import { usePrefersReducedMotion } from "@/hooks/use-prefers-reduced-motion";
import {
  REVEAL_VIEWPORT,
  getRevealVariants,
  type RevealVariant,
} from "@/lib/reveal-motion";
import { cn } from "@/lib/utils";

type RevealWhen = "scroll" | "mount";
type MotionTag = "div" | "section" | "article" | "span" | "p" | "h1" | "h2" | "h3";

type MotionComp = typeof motion.div;

function resolveMotion(Tag: MotionTag = "div"): MotionComp {
  switch (Tag) {
    case "section":
      return motion.section as MotionComp;
    case "article":
      return motion.article as MotionComp;
    case "span":
      return motion.span as MotionComp;
    case "p":
      return motion.p as MotionComp;
    case "h1":
      return motion.h1 as MotionComp;
    case "h2":
      return motion.h2 as MotionComp;
    case "h3":
      return motion.h3 as MotionComp;
    default:
      return motion.div;
  }
}

interface RevealTransitionProps {
  variant?: RevealVariant;
  delay?: number;
  duration?: number;
  y?: number;
}

interface RevealProps
  extends RevealTransitionProps,
    Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "variants" | "transition"> {
  when?: RevealWhen;
  once?: boolean;
  as?: MotionTag;
  className?: string;
  children: React.ReactNode;
}

/**
 * Scroll-triggered entrance primitive — the studio's standard motion layer.
 *
 * Uses Framer Motion `whileInView` (Intersection Observer). No scroll
 * listeners. Reduced motion → instant render, no hidden initial state.
 *
 * @example
 * <Reveal delay={0.1}><h1>Title</h1></Reveal>
 */
export function Reveal({
  variant = "fade-up",
  delay = 0,
  duration,
  y,
  when = "scroll",
  once = true,
  className,
  children,
  as: Tag = "div",
  ...rest
}: RevealProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const Comp = resolveMotion(Tag);

  if (prefersReducedMotion) {
    return React.createElement(Tag, { className }, children);
  }

  const variants = getRevealVariants(variant, { delay, duration, y });
  const isScroll = when === "scroll";

  return (
    <Comp
      variants={variants}
      initial="hidden"
      animate={isScroll ? undefined : "visible"}
      whileInView={isScroll ? "visible" : undefined}
      viewport={isScroll ? { ...REVEAL_VIEWPORT, once } : undefined}
      className={cn(className)}
      {...rest}
    >
      {children}
    </Comp>
  );
}

interface RevealGroupProps
  extends Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "variants"> {
  when?: RevealWhen;
  once?: boolean;
  delayChildren?: number;
  staggerChildren?: number;
  className?: string;
  children: React.ReactNode;
}

/** Staggered group — one viewport trigger, sequential child reveals. */
function RevealGroup({
  when = "scroll",
  once = true,
  delayChildren = 0.08,
  staggerChildren = 0.09,
  className,
  children,
  ...rest
}: RevealGroupProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const isScroll = when === "scroll";

  return (
    <motion.div
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren, delayChildren },
        },
      }}
      initial="hidden"
      animate={isScroll ? undefined : "visible"}
      whileInView={isScroll ? "visible" : undefined}
      viewport={isScroll ? { ...REVEAL_VIEWPORT, once } : undefined}
      className={cn(className)}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps
  extends RevealTransitionProps,
    Omit<HTMLMotionProps<"div">, "initial" | "animate" | "whileInView" | "variants" | "transition"> {
  as?: MotionTag;
  className?: string;
  children: React.ReactNode;
}

/** Child of `Reveal.Group` — inherits stagger from parent. */
function RevealItem({
  variant = "fade-up",
  delay = 0,
  duration,
  y,
  className,
  children,
  as: Tag = "div",
  ...rest
}: RevealItemProps) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const Comp = resolveMotion(Tag);

  if (prefersReducedMotion) {
    return React.createElement(Tag, { className }, children);
  }

  const variants = getRevealVariants(variant, { delay, duration, y });

  return (
    <Comp variants={variants} className={cn(className)} {...rest}>
      {children}
    </Comp>
  );
}

Reveal.Group = RevealGroup;
Reveal.Item = RevealItem;

export { RevealGroup, RevealItem };
