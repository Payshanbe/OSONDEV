import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";
import {
  buildWorkImagePath,
  getBlobToken,
  isBlobStorageEnabled,
  validateImageFile,
} from "@/lib/blob";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isBlobStorageEnabled()) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Add BLOB_READ_WRITE_TOKEN in Vercel → Storage → Blob, then redeploy.",
      },
      { status: 503 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const slug = String(formData.get("slug") ?? "").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ error: "Project slug is required before upload." }, { status: 400 });
    }

    const validationError = validateImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const pathname = buildWorkImagePath(slug, file.name);
    const blob = await put(pathname, file, {
      access: "public",
      token: getBlobToken(),
    });

    return NextResponse.json({ url: blob.url });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
