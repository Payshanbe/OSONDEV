import { ADMIN_COOKIE_MAX_AGE_SEC, getAuthSecret } from "@/lib/auth/constants";

function timingSafeEqualStrings(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

async function hmacBase64Url(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return Buffer.from(signature).toString("base64url");
}

/** Edge-safe session verification for middleware. */
export async function verifySessionTokenEdge(
  token: string | undefined | null,
): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  let secret: string;
  try {
    secret = getAuthSecret();
  } catch {
    return false;
  }

  const expected = await hmacBase64Url(payload, secret);
  if (!timingSafeEqualStrings(sig, expected)) return false;

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
