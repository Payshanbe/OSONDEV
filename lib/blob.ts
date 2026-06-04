/** Vercel Blob — work cover images and short videos. */

const MAX_IMAGE_BYTES = 4 * 1024 * 1024; // 4 MB
const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50 MB

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

const VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

export const BLOB_UPLOAD_CONTENT_TYPES = [
  ...IMAGE_TYPES,
  ...VIDEO_TYPES,
] as string[];

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim();
}

export function isVideoMime(type: string): boolean {
  return VIDEO_TYPES.has(type);
}

export function validateMediaFile(file: File): string | null {
  if (!file.size) return "File is empty.";

  if (IMAGE_TYPES.has(file.type)) {
    if (file.size > MAX_IMAGE_BYTES) return "Images must be 4 MB or smaller.";
    return null;
  }

  if (VIDEO_TYPES.has(file.type)) {
    if (file.size > MAX_VIDEO_BYTES) return "Videos must be 50 MB or smaller.";
    return null;
  }

  return "Use JPEG, PNG, WebP, AVIF, GIF, MP4, WebM, or MOV.";
}

export function buildWorkMediaPath(slug: string, filename: string): string {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || "draft";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  return `work/${safeSlug}/${Date.now()}-${safeName}`;
}

export const BLOB_MAX_UPLOAD_BYTES = MAX_VIDEO_BYTES;
