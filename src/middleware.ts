import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const getJwtSecret = () => new TextEncoder().encode(process.env.JWT_SECRET || "default_super_secret_jwt_key_that_is_long_enough");

// --- Rate Limiter (en-mémoire, par isolate Edge) ---
// Note: En mode Serverless, cela est remis à zéro par instance, 
// mais reste suffisant pour limiter le spam basique.
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_MAX = 5; // requêtes
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (now - record.lastReset > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return false;
  }

  record.count += 1;
  return true;
}

export async function middleware(request: NextRequest) {
  const isLoginPage = request.nextUrl.pathname === "/admin/login";
  const isAdminRoute = request.nextUrl.pathname.startsWith("/admin");
  const isApiRoute = request.nextUrl.pathname.startsWith("/api/");
  const isPostRequest = request.method === "POST" || request.method === "PUT" || request.method === "DELETE";

  // 1. Rate Limiting sur les routes API (POST)
  if (isApiRoute && isPostRequest) {
    const ip = request.ip || request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Trop de requêtes, veuillez réessayer plus tard." }, { status: 429 });
    }
  }

  // 2. CSRF Basique pour les POST (Vérification de l'Origin)
  if (isPostRequest && !request.nextUrl.pathname.startsWith("/api/webhooks")) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");
    // S'il y a un origin, on s'assure qu'il correspond au host (protection simple)
    if (origin && host && !origin.includes(host)) {
      return NextResponse.json({ error: "Requête non autorisée (CSRF)." }, { status: 403 });
    }
  }

  // 3. Gestion de l'authentification Admin
  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("admin_token")?.value;
  let isAuthenticated = false;

  if (token) {
    try {
      await jwtVerify(token, getJwtSecret());
      isAuthenticated = true;
    } catch (e) {
      isAuthenticated = false;
    }
  }

  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    const redirectUrl = new URL("/admin/login", request.url);
    return NextResponse.redirect(redirectUrl);
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // On matche l'admin et l'API pour appliquer le middleware
    "/admin/:path*", 
    "/api/:path*"
  ],
};
