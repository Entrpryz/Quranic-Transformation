
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/profile", "/admin"];
const publicRoutes = ["/auth/login", "/auth/register", "/", "/auth/verify-email", "/auth/resend"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some((route) => path.startsWith(route));
  // FIX: Handle "/" specifically to avoid matching all routes
  const isPublicRoute = publicRoutes.some((route) => {
      if (route === "/") return path === "/";
      return path.startsWith(route);
  });

  // 3. Decrypt the session from the cookie
  const cookie = req.cookies.get("session")?.value;
  const session = await decrypt(cookie || "");

  // 4. Redirect to /login if the user is not authenticated on a protected route
  if (isProtectedRoute && !session?.userId) {
    return NextResponse.redirect(new URL("/auth/login", req.nextUrl));
  }

  // 5. Redirect to /dashboard if the user is already authenticated on a public route
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
