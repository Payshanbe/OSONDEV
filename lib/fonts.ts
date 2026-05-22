import { Comfortaa, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

/**
 * Primary UI typeface — Geist Sans.
 * Variable mode + display swap for fast, jankless first paint.
 */
/** Wordmark — OSON brand lockup */
export const fontBrand = Comfortaa({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  weight: "700",
  variable: "--font-brand",
});

export const fontSans = Geist({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/**
 * Editorial serif used for accents in headlines and pull quotes.
 * Pairs Geist Sans with the warmth of a classic display serif.
 */
export const fontSerif = Instrument_Serif({
  subsets: ["latin"],
  display: "swap",
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
});

/**
 * Monospace used for code-like metadata, captions, and chrome details.
 */
export const fontMono = Geist_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});
