"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";

interface CoverImageFieldProps {
  initialUrl?: string;
  /** Known slug on edit; on new project leave empty and set slug in form first */
  slug?: string;
}

export function CoverImageField({ initialUrl = "", slug = "" }: CoverImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [url, setUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function upload(file: File) {
    const slugInput = document.querySelector<HTMLInputElement>('input[name="slug"]');
    const projectSlug = slugInput?.value.trim() || slug;
    if (!projectSlug) {
      setError("Enter a project slug first, then upload.");
      return;
    }

    setUploading(true);
    setError("");

    const body = new FormData();
    body.append("file", file);
    body.append("slug", projectSlug);

    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      if (data.url) setUrl(data.url);
    } catch {
      setError("Upload failed. Check your connection.");
    } finally {
      setUploading(false);
    }
  }

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void upload(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/20 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Cover image
        </span>
        {url ? (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="inline-flex items-center gap-1.5 text-xs text-red-400/90 hover:text-red-300"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove
          </button>
        ) : null}
      </div>

      <input type="hidden" name="coverImage" value={url} />

      {url ? (
        <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-lg border border-border/60">
          <Image src={url} alt="Project cover preview" fill className="object-cover" sizes="400px" />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground/80">
          No cover yet — uses the default card style on the site.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
          className="sr-only"
          onChange={onPick}
          disabled={uploading}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-lg border border-border/70 bg-background/60 px-3 py-2 text-sm text-foreground transition-colors hover:bg-secondary/50 disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <ImagePlus className="size-4" aria-hidden />
          )}
          {uploading ? "Uploading…" : url ? "Replace image" : "Upload image"}
        </button>
      </div>

      {error ? <p className="text-xs text-red-400/90">{error}</p> : null}
      <p className="text-xs text-muted-foreground/70">
        Stored on Vercel Blob (max 4 MB). WebP recommended. Save the project after upload.
      </p>
    </div>
  );
}
