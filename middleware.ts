import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { ADMIN_COOKIE_NAME } from "@/lib/auth/constants";
import { verifySessionTokenEdge } from "@/lib/auth/session-edge";
import {
  defaultLocale,
  isValidLocale,
  localeCookieName,
  locales,
} from "@/lib/i18n/config";

async function handleAdmin(request: NextRequest): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(ADMIN_COOKIE_NAME)?.value;

  if (pathname === "/admin/login") {
    if (await verifySessionTokenEdge(token)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!(await verifySessionTokenEdge(token))) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("from", pathname);
    return NextResponse.redirect(login);
  }

  return NextResponse.next();
}

function handleLocale(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );

  if (pathnameHasLocale) {
    const segment = pathname.split("/")[1];
    const response = NextResponse.next();
    if (isValidLocale(segment)) {
      response.cookies.set(localeCookieName, segment, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
        sameSite: "lax",
      });
    }
    return response;
  }

  const cookieLocale = request.cookies.get(localeCookieName)?.value;
  const locale = isValidLocale(cookieLocale) ? cookieLocale : defaultLocale;

  const url = request.nextUrl.clone();
  url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return handleAdmin(request);
  }

  return handleLocale(request);
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    // Skip locale redirect for static assets (files with extensions + Next metadata routes).
    "/((?!_next|api|favicon\\.ico|icon\\.png|apple-icon\\.png|icon-512\\.png|logo-oson\\.png|og\\.png|robots\\.txt|sitemap\\.xml|.*\\..*).*)",
  ],
};
