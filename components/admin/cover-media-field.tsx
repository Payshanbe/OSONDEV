"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { upload } from "@vercel/blob/client";
import { Film, ImagePlus, Loader2, Trash2 } from "lucide-react";

import { buildWorkMediaPath, isVideoMime, validateMediaFile } from "@/lib/blob";

interface CoverMediaFieldProps {
  initialImage?: string;
  initialVideo?: string;
  slug?: string;
}

export function CoverMediaField({
  initialImage = "",
  initialVideo = "",
  slug = "",
}: CoverMediaFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [coverImage, setCoverImage] = useState(initialImage);
  const [coverVideo, setCoverVideo] = useState(initialVideo);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const hasMedia = Boolean(coverImage || coverVideo);

  function clearMedia() {
    setCoverImage("");
    setCoverVideo("");
  }

  async function uploadFile(file: File) {
    const slugInput = document.querySelector<HTMLInputElement>('input[name="slug"]');
    const projectSlug = slugInput?.value.trim() || slug;
    if (!projectSlug) {
      setError("Enter a project slug first, then upload.");
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

      if (isVideoMime(file.type)) {
        setCoverImage("");
        setCoverVideo(blob.url);
      } else {
        setCoverVideo("");
        setCoverImage(blob.url);
      }
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

  return (
    <div className="space-y-3 rounded-lg border border-border/50 bg-secondary/20 p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Cover image or video
        </span>
        {hasMedia ? (
          <button
            type="button"
            onClick={clearMedia}
            className="inline-flex items-center gap-1.5 text-xs text-red-400/90 hover:text-red-300"
          >
            <Trash2 className="size-3.5" aria-hidden />
            Remove
          </button>
        ) : null}
      </div>

      <input type="hidden" name="coverImage" value={coverImage} />
      <input type="hidden" name="coverVideo" value={coverVideo} />

      {coverVideo ? (
        <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-lg border border-border/60">
          <video
            src={coverVideo}
            className="h-full w-full object-cover"
            muted
            loop
            playsInline
            autoPlay
            controls
          />
        </div>
      ) : coverImage ? (
        <div className="relative aspect-[16/10] w-full max-w-md overflow-hidden rounded-lg border border-border/60">
          <Image src={coverImage} alt="Project cover preview" fill className="object-cover" sizes="400px" />
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
          accept="image/jpeg,image/png,image/webp,image/avif,image/gif,video/mp4,video/webm,video/quicktime"
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
          ) : coverVideo ? (
            <Film className="size-4" aria-hidden />
          ) : (
            <ImagePlus className="size-4" aria-hidden />
          )}
          {uploading ? "Uploading…" : hasMedia ? "Replace" : "Upload image or video"}
        </button>
      </div>

      {error ? <p className="text-xs text-red-400/90">{error}</p> : null}
      <p className="text-xs text-muted-foreground/70">
        Vercel Blob: images up to 4 MB, short videos (MP4/WebM/MOV) up to 50 MB. Save the project
        after upload.
      </p>
    </div>
  );
}
