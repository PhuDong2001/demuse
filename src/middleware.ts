import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("demuse_session")?.value;

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isPublicPage =
    pathname === "/" ||
    pathname.startsWith("/share") ||
    pathname.startsWith("/about") ||
    pathname.startsWith("/privacy") ||
    pathname.startsWith("/terms");

  // Allow public landing page, share token page, login, and register to load directly!
  if (isPublicPage || isAuthPage) {
    return NextResponse.next();
  }

  // Protect private application workspace routes (/timetable, /subjects, /settings)
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
  ],
};
