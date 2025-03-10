import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get("access_token")?.value;

  // Debugging: Log the access token and requested path
  console.log("Access Token:", accessToken);
  console.log("Requested Path:", request.nextUrl.pathname);

  const protectedRoutes = ["/expenses", "/budget", "/goals", "/insights"];

  if (!accessToken && protectedRoutes.includes(request.nextUrl.pathname)) {
    console.log("Redirecting to login...");
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Apply middleware to all pages
export const config = {
  matcher: ["/expenses", "/budget", "/goals", "/insights"],
};