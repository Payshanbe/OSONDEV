export const ADMIN_COOKIE_NAME = "sitan_admin_session";
export const ADMIN_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;

function normalizeEnv(value: string | undefined): string | undefined {
  const trimmed = value?.replace(/^\uFEFF/, "").trim();
  return trimmed || undefined;
}

export function getConfiguredAdminPassword(): string | undefined {
  return normalizeEnv(process.env.ADMIN_PASSWORD);
}

export function getAuthSecret(): string {
  const secret =
    normalizeEnv(process.env.ADMIN_SECRET) ?? normalizeEnv(process.env.ADMIN_PASSWORD);
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_PASSWORD or ADMIN_SECRET must be set in production");
    }
    return "dev-admin-change-me";
  }
  return secret;
}
