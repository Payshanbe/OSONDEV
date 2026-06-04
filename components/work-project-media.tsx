import Image from "next/image";

import { cn } from "@/lib/utils";
import type { WorkMediaItem } from "@/lib/content/types";

interface WorkMediaItemViewProps {
  item: WorkMediaItem;
  title: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  showControls?: boolean;
}

export function WorkMediaItemView({
  item,
  title,
  className,
  fill = true,
  priority = false,
  showControls = false,
}: WorkMediaItemViewProps) {
  if (item.type === "video") {
    return (
      <video
        src={item.url}
        className={cn("object-cover", fill ? "absolute inset-0 h-full w-full" : className)}
        muted
        loop
        playsInline
        autoPlay
        controls={showControls}
        aria-label={title}
      />
    );
  }

  return (
    <Image
      src={item.url}
      alt={title}
      fill={fill}
      className={cn("object-cover", !fill && className)}
      sizes={fill ? "(max-width: 1024px) 100vw, 50vw" : "400px"}
      priority={priority}
    />
  );
}

interface WorkProjectGalleryProps {
  items: WorkMediaItem[];
  title: string;
  variant?: "grid" | "stack";
}

export function WorkProjectGallery({
  items,
  title,
  variant = "grid",
}: WorkProjectGalleryProps) {
  if (!items.length) return null;

  if (variant === "stack") {
    return (
      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={`${item.url}-${index}`}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-border/50"
          >
            <WorkMediaItemView
              item={item}
              title={title}
              priority={index === 0}
              showControls={item.type === "video"}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        items.length === 1 ? "grid-cols-1" : "sm:grid-cols-2",
      )}
    >
      {items.map((item, index) => (
        <div
          key={`${item.url}-${index}`}
          className={cn(
            "relative overflow-hidden rounded-2xl border border-border/50",
            index === 0 && items.length > 1 ? "sm:col-span-2 aspect-[16/9]" : "aspect-[16/10]",
            items.length === 1 && "aspect-[16/9] max-w-3xl",
          )}
        >
          <WorkMediaItemView
            item={item}
            title={title}
            priority={index === 0}
            showControls={item.type === "video"}
          />
        </div>
      ))}
    </div>
  );
}
