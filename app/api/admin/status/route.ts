import { NextResponse } from "next/server";

import { getAdminPasswordLength, isAdminPasswordConfigured } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

/** Safe health check — never exposes the password, only whether it is configured. */
export async function GET() {
  const configured = isAdminPasswordConfigured();

  return NextResponse.json({
    configured,
    length: configured ? getAdminPasswordLength() : 0,
  });
}
