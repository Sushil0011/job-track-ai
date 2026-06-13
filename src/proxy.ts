import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.has("refresh_token");
  if (
    (token && request.nextUrl.pathname.startsWith("/login")) ||
    request.nextUrl.pathname.startsWith("/signup")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!token && request.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
};
