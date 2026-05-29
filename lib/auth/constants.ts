export const ADMIN_COOKIE_NAME = "sitan_admin_session";
export const ADMIN_COOKIE_MAX_AGE_SEC = 60 * 60 * 24 * 7;

export function getAuthSecret(): string {
  const secret = process.env.ADMIN_SECRET?.trim() ?? process.env.ADMIN_PASSWORD?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("ADMIN_PASSWORD or ADMIN_SECRET must be set in production");
    }
    return "dev-admin-change-me";
  }
  return secret;
}
