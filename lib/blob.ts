/** Vercel Blob — project images (work covers). */

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
]);

export function isBlobStorageEnabled(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN?.trim();
}

export function validateImageFile(file: File): string | null {
  if (!file.size) return "File is empty.";
  if (file.size > MAX_BYTES) return "Image must be 4 MB or smaller.";
  if (!ALLOWED_TYPES.has(file.type)) {
    return "Use JPEG, PNG, WebP, AVIF, or GIF.";
  }
  return null;
}

export function buildWorkImagePath(slug: string, filename: string): string {
  const safeSlug = slug.replace(/[^a-z0-9-]/gi, "-").toLowerCase() || "draft";
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  return `work/${safeSlug}/${Date.now()}-${safeName}`;
}
