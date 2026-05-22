/**
 * Studio background tokens — single source for aurora palette and layering.
 * Values are tuned for dark UI; kept as plain strings for inline styles.
 */
export const backgroundLayers = {
  /** Stacking order (low → high) within the fixed background shell */
  zIndex: {
    base: 0,
    aurora: 1,
    grid: 2,
    vignette: 3,
    noise: 4,
    content: 10,
  },
} as const;

/** Aurora blob definitions — soft, desaturated, no neon */
export const auroraBlobs = [
  {
    id: "violet",
    className: "aurora-blob aurora-blob--violet",
    style: {
      background:
        "radial-gradient(closest-side, hsl(263 72% 58% / 0.42), hsl(263 72% 58% / 0.1) 48%, transparent 72%)",
    },
    position: "left-1/2 top-[-20%] h-[min(68rem,120vh)] w-[min(68rem,120vw)] -translate-x-1/2",
    animation: "aurora-drift-a 26s ease-in-out infinite",
  },
  {
    id: "blue",
    className: "aurora-blob aurora-blob--blue",
    style: {
      background:
        "radial-gradient(closest-side, hsl(220 78% 56% / 0.28), hsl(220 78% 56% / 0.07) 52%, transparent 78%)",
    },
    position: "-bottom-48 -left-28 h-[min(44rem,90vh)] w-[min(44rem,90vw)]",
    animation: "aurora-drift-b 34s ease-in-out infinite",
  },
  {
    id: "cyan",
    className: "aurora-blob aurora-blob--cyan",
    style: {
      background:
        "radial-gradient(closest-side, hsl(199 88% 54% / 0.26), hsl(199 88% 54% / 0.06) 55%, transparent 80%)",
    },
    position: "-bottom-40 right-[-8%] h-[min(38rem,80vh)] w-[min(38rem,80vw)]",
    animation: "aurora-drift-c 42s ease-in-out infinite",
  },
  {
    id: "glow",
    className: "aurora-blob aurora-blob--glow",
    style: {
      background:
        "radial-gradient(closest-side, hsl(0 0% 100% / 0.06), hsl(0 0% 100% / 0.02) 40%, transparent 70%)",
    },
    position: "left-1/2 top-[8%] h-[28rem] w-[48rem] -translate-x-1/2",
    animation: "aurora-drift-a 38s ease-in-out infinite reverse",
  },
] as const;
