"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Loader2, Plus, Trash2 } from "lucide-react";

import { buildWorkMediaPath, isVideoMime, validateMediaFile } from "@/lib/blob";
import { normalizeWorkProject } from "@/lib/content/normalize-work-project";
import type { WorkMediaItem, WorkProject } from "@/lib/content/types";

const MAX_ITEMS = 12;

interface GalleryMediaFieldProps {
  project: Pick<WorkProject, "gallery" | "coverImage" | "coverVideo">;
  slug?: string;
}

export function GalleryMediaField({ project, slug = "" }: GalleryMediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<WorkMediaItem[]>(
    () => normalizeWorkProject(project as WorkProject).gallery ?? [],
  );
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function uploadFile(file: File) {
    const slugInput = document.querySelector<HTMLInputElement>('input[name="slug"]');
    const projectSlug = slugInput?.value.trim() || slug;
    if (!projectSlug) {
      setError("Enter a project slug first, then upload.");
      return;
    }

    if (items.length >= MAX_ITEMS) {
      setError(`Maximum ${MAX_ITEMS} files per project.`);
      return;
    }

    const validationError = validateMediaFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setUploading(true);
    setError("");

    try {
      const pathname = buildWorkMediaPath(projectSlug, file.name);
      const blob = await upload(pathname, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });

      const type: WorkMediaItem["type"] = isVideoMime(file.type) ? "video" : "image";
      setItems((prev) => [...prev, { url: blob.url, type }]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void uploadFile(file);
    e.target.value = "";
  }

  function removeAt(index: number) {
    setItems((prev) => prev.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/50 bg-secondary/20 p-4">
      <div>
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Gallery (images & videos)
        </span>
        <p className="mt-1 text-xs text-muted-foreground/80">
          Add multiple files — e.g. photo + motion reel. First item is the card cover on the
          homepage.
        </p>
      </div>

      {items.map((item, index) => (
        <div
          key={`${item.url}-${index}`}
          className="flex gap-4 rounded-lg border border-border/40 bg-background/30 p-3"
        >
          <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md border border-border/50">
            {item.type === "video" ? (
              <video
                src={item.url}
                className="h-full w-full object-cover"
                muted
                playsInline
              />
            ) : (
              <Image src={item.url} alt="" fill className="object-cover" sizes="128px" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              {index === 0 ? "Cover · " : ""}
              {item.type}
            </p>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.url}</p>
            <input type="hidden" name="galleryUrl" value={item.url} />
            <input type="hidden" name="galleryType" value={item.type} />
          </div>
          <button
            type="button"
            onClick={() => removeAt(index)}
            className="shrink-0 self-start text-xs text-red-400/90 hover:text-red-300"
            aria-label={`Remove item ${index + 1}`}
          >
            <Trash2 className="size-4" />
          </button>
        </div>
      ))}

      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground/80">
          No media yet — default placeholder on the site.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime"
          className="sr-only"
          onChange={onPick}
          disabled={uploading || items.length >= MAX_ITEMS}
        />
        <button
          type="button"
          disabled={uploading || items.length >= MAX_ITEMS}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary/50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Plus className="size-4" aria-hidden />
          )}
          {uploading ? "Uploading…" : "Add image or video"}
        </button>
        <span className="text-xs text-muted-foreground/70">
          {items.length}/{MAX_ITEMS}
        </span>
      </div>

      {error ? <p className="text-xs text-red-400/90">{error}</p> : null}
      <p className="text-xs text-muted-foreground/70">
        Images ≤ 4 MB · videos ≤ 50 MB. Remember Hobby Blob limit is 1 GB total.
      </p>
    </div>
  );
}
