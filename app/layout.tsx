import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/theme-provider";
import { MotionProvider } from "@/components/motion-provider";
import { NoiseOverlay } from "@/components/noise-overlay";
import { SkipLink } from "@/components/skip-link";
import { SiteBackground } from "@/components/site-background";
import { fontBrand, fontMono, fontSans, fontSerif } from "@/lib/fonts";
import { getSiteConfig } from "@/lib/content";
import { cn } from "@/lib/utils";

import "./globals.css";

/** Title/metadata live on locale pages only — root metadata caused duplicate titles in SERP. */

export const metadata: Metadata = {
  metadataBase: new URL(getSiteConfig().url),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  colorScheme: "dark",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,
        fontBrand.variable,
        "dark",
      )}
    >
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>
          <MotionProvider>
            {/* Layers 1–3: base · aurora · grid · vignette */}
            <SiteBackground />
            {/* Layer 4: film grain (below content, textures the canvas) */}
            <NoiseOverlay />
            {/* Layer 5: page content */}
            <div className="relative z-10">
              <SkipLink />
              {children}
            </div>
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
