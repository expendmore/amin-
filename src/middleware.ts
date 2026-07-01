import { NextResponse, type NextRequest } from "next/server";

/**
 * ExpendMore Middleware — Route Protection
 *
 * Security model:
 * - Edge runtime: cannot use Firebase Admin (no Node.js APIs)
 * - Fast path: decode JWT claims without full signature verify
 * - Full verification: happens in each API route via firebase-admin.ts
 *
 * JWT structure: header.payload.signature (base64url encoded)
 * We check: token exists, is a valid JWT shape, and is not expired.
 * Cryptographic signature verification is done in API routes.
 */

const COOKIE_NAME = "firebase-token";

/**
 * Decode a JWT payload without verifying signature.
 * Returns null if the token is malformed or expired.
 */
function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    // Base64url decode the payload (second part)
    const payloadBase64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = payloadBase64 + "==".slice((payloadBase64.length + 2) % 3 + 1);
    const decoded = atob(paddedPayload);
    return JSON.parse(decoded) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/**
 * Check if a decoded JWT payload is not yet expired.
 * Firebase tokens expire after 1 hour.
 */
function isTokenExpired(payload: Record<string, unknown>): boolean {
  const exp = payload["exp"];
  if (typeof exp !== "number") return true;
  return Date.now() / 1000 > exp;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Define protected routes requiring authentication
  const isProtectedRoute =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/workspace") ||
    pathname.startsWith("/billing") ||
    pathname.startsWith("/contacts") ||
    pathname.startsWith("/campaigns") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/workflows") ||
    pathname.startsWith("/apis") ||
    pathname.startsWith("/integrations") ||
    pathname.startsWith("/whatsapp") ||
    pathname.startsWith("/analytics") ||
    pathname.startsWith("/files") ||
    pathname.startsWith("/scheduler") ||
    pathname.startsWith("/commerce") ||
    pathname.startsWith("/google") ||
    pathname.startsWith("/microsoft") ||
    pathname.startsWith("/ai") ||
    pathname.startsWith("/knowledge") ||
    pathname.startsWith("/marketplace") ||
    pathname.startsWith("/developer") ||
    pathname.startsWith("/monitoring") ||
    pathname.startsWith("/qa") ||
    pathname.startsWith("/devops");

  const isAuthRoute =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup");

  // Extract token from HttpOnly cookie
  const rawToken = request.cookies.get(COOKIE_NAME)?.value;

  // Evaluate token validity at the edge
  let isValidToken = false;

  if (rawToken) {
    const payload = decodeJwtPayload(rawToken);
    if (payload && !isTokenExpired(payload)) {
      isValidToken = true;
    }
    // Expired tokens: fall through as unauthenticated — client will get a new token
    // and call /api/auth/session to refresh the cookie
  }

  // Redirect unauthenticated users away from protected routes
  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from login/signup
  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/chat", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public assets (svg, png, jpg, etc.)
     * - api routes (they handle their own auth via firebase-admin.ts)
     */
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
