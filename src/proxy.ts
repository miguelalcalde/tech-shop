import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const userAgent = request.headers.get("user-agent") || ""

  /**
   * Uncomment either of the following to test the redirects
   */
  // Check if the path is root and browser is Chrome
  // if (pathname === "/" && userAgent.includes("Chrome")) {
  //   return NextResponse.redirect(new URL("/cms", request.url));
  // }

  // // Handle existing about path redirect
  // if (pathname.startsWith("/about")) {
  //   return NextResponse.redirect(new URL("/home", request.url));
  // }

  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/:path*"],
}

