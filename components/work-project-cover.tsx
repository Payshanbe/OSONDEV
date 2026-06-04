import { getPrimaryMedia, normalizeWorkProject } from "@/lib/content/normalize-work-project";
import type { WorkProject } from "@/lib/content/types";
import { cn } from "@/lib/utils";

import { WorkMediaItemView } from "@/components/work-project-media";

interface WorkProjectCoverProps {
  project: Pick<WorkProject, "gallery" | "coverImage" | "coverVideo" | "accent" | "glow" | "title">;
  variant?: "card" | "hero";
}

function CoverFrame({
  variant,
  glow,
  children,
}: {
  variant: "card" | "hero";
  glow: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "relative w-full overflow-hidden",
        variant === "card" ? "aspect-[16/10] rounded-t-[15px]" : "aspect-[16/9] rounded-2xl",
      )}
    >
      {children}
      <div
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent",
          variant === "hero" && "from-background/90",
        )}
      />
      {variant === "card" ? (
        <span
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse 90% 40% at 50% -10%, ${glow}, transparent 70%)`,
          }}
        />
      ) : null}
    </div>
  );
}

export function WorkProjectCover({ project, variant = "card" }: WorkProjectCoverProps) {
  const normalized = normalizeWorkProject(project as WorkProject);
  const primary = getPrimaryMedia(normalized);
  const { accent, glow, title } = project;

  if (primary) {
    return (
      <CoverFrame variant={variant} glow={glow}>
        <WorkMediaItemView
          item={primary}
          title={title}
          priority={variant === "hero"}
        />
      </CoverFrame>
    );
  }

  if (variant === "hero") {
    return (
      <div
        className="relative aspect-[16/9] w-full max-w-3xl overflow-hidden rounded-2xl border border-border/50"
        style={{ backgroundColor: accent }}
      />
    );
  }

  return (
    <div className="relative overflow-hidden rounded-t-[15px]">
      <div
        aria-hidden
        className={cn(
          "relative aspect-[16/10] w-full bg-gradient-to-br from-muted/90 to-muted/40",
          "before:absolute before:inset-0 before:bg-gradient-to-t before:from-background/80 before:via-transparent before:to-transparent",
        )}
        style={{ backgroundColor: accent }}
      >
        <div className="absolute inset-[12%] rounded-lg border border-white/10 bg-background/45 shadow-2xl backdrop-blur-sm">
          <div className="flex h-full flex-col p-4 sm:p-5">
            <div className="flex gap-1.5 pb-4">
              <span className="h-2 w-2 rounded-full bg-white/25" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
              <span className="h-2 w-2 rounded-full bg-white/15" />
            </div>
            <div className="flex flex-1 gap-3">
              <div className="w-2/5 space-y-2 rounded-md border border-white/10 bg-white/[0.04] p-2">
                <div className="h-1 rounded bg-white/20" />
                <div className="h-1 w-[85%] rounded bg-white/10" />
                <div className="h-1 w-[66%] rounded bg-white/10" />
                <div className="mt-auto h-8 rounded bg-gradient-to-r from-white/18 to-transparent" />
              </div>
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-24 rounded-lg border border-white/10 bg-gradient-to-br from-white/[0.07] to-transparent" />
                <div className="grid flex-1 grid-cols-2 gap-2">
                  <div className="rounded-md border border-white/10 bg-white/[0.04]" />
                  <div className="rounded-md border border-white/10 bg-white/[0.04]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
