import { createHmac, timingSafeEqual } from "crypto";

import { ADMIN_COOKIE_MAX_AGE_SEC, ADMIN_COOKIE_NAME, getAuthSecret } from "@/lib/auth/constants";

export function getAdminCookieName() {
  return ADMIN_COOKIE_NAME;
}

export function getAdminCookieMaxAge() {
  return ADMIN_COOKIE_MAX_AGE_SEC;
}

export function createSessionToken(): string {
  const issuedAt = Date.now();
  const payload = Buffer.from(JSON.stringify({ role: "admin", iat: issuedAt })).toString(
    "base64url",
  );
  const sig = createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = createHmac("sha256", getAuthSecret()).update(payload).digest("base64url");

  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    if (!timingSafeEqual(a, b)) return false;
  } catch {
    return false;
  }

  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf-8")) as {
      role?: string;
      iat?: number;
    };
    if (data.role !== "admin" || typeof data.iat !== "number") return false;
    if (Date.now() - data.iat > ADMIN_COOKIE_MAX_AGE_SEC * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    if (process.env.NODE_ENV === "production") return false;
    return password === "dev-admin-change-me";
  }
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}
