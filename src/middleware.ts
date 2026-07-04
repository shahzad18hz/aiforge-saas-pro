import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = ["/", "/auth/login", "/auth/register", "/auth/forgot-password", "/auth/reset-password", "/auth/error"];
const API_PUBLIC = ["/api/auth"];
const ADMIN_PATHS = ["/admin"];
const RATE_LIMIT_MAP = new Map<string, { count: number; reset: number }>();

function isRateLimited(ip: string, limit = 60, windowMs = 60_000): boolean {
  const now = Date.now();
  const record = RATE_LIMIT_MAP.get(ip);
  if (!record || now > record.reset) {
    RATE_LIMIT_MAP.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  if (record.count >= limit) return true;
  record.count++;
  return false;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "unknown";

  // Rate limiting for API routes
  if (pathname.startsWith("/api/generate")) {
    if (isRateLimited(ip, 30, 60_000)) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }
  }
  if (pathname.startsWith("/api") && !pathname.startsWith("/api/auth") && !pathname.startsWith("/api/stripe/webhook")) {
    if (isRateLimited(`api:${ip}`, 100, 60_000)) {
      return NextResponse.json({ error: "Rate limit exceeded." }, { status: 429 });
    }
  }

  // Allow public API routes
  if (API_PUBLIC.some(p => pathname.startsWith(p))) return NextResponse.next();

  // Allow Stripe webhooks without auth
  if (pathname === "/api/stripe/webhook") return NextResponse.next();

  // Get session token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // Redirect authenticated users away from auth pages
  if (PUBLIC_PATHS.includes(pathname) && token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Allow public paths
  if (PUBLIC_PATHS.includes(pathname) || pathname === "/") return NextResponse.next();

  // Protect all other routes
  if (!token) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes
  if (ADMIN_PATHS.some(p => pathname.startsWith(p))) {
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Security headers
  const res = NextResponse.next();
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  res.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  res.headers.set("X-XSS-Protection", "1; mode=block");

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico).*)",
  ],
};
