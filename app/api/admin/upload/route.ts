import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ADMIN_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionToken } from "@/lib/auth/session";
import {
  BLOB_MAX_UPLOAD_BYTES,
  BLOB_UPLOAD_CONTENT_TYPES,
  isBlobStorageEnabled,
} from "@/lib/blob";

export const runtime = "nodejs";

async function requireAdminUpload(): Promise<NextResponse | null> {
  const token = (await cookies()).get(ADMIN_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isBlobStorageEnabled()) {
    return NextResponse.json(
      {
        error:
          "Blob storage is not configured. Connect a Blob store on Vercel (with read-write token), then redeploy.",
      },
      { status: 503 },
    );
  }
  return null;
}

/** Client upload handler — images + short videos (direct to Blob, up to 50 MB). */
export async function POST(request: Request): Promise<NextResponse> {
  const denied = await requireAdminUpload();
  if (denied) return denied;

  try {
    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: BLOB_UPLOAD_CONTENT_TYPES,
        maximumSizeInBytes: BLOB_MAX_UPLOAD_BYTES,
        addRandomSuffix: true,
      }),
      onUploadCompleted: async () => {
        /* URL returned to the client by @vercel/blob/client upload() */
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (e) {
    const message = e instanceof Error ? e.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
