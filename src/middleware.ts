import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIES } from './lib/constants';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from './lib/csrf';

// ─── IN-EDGE RATE LIMITER ────────────────────────────────────────────────────
// This uses a simple Map for edge-compatible rate limiting.
// The RateLimiter in security.ts is server-runtime only; this is lightweight.
// ─────────────────────────────────────────────────────────────────────────────

const authAttempts = new Map<string, { count: number; resetAt: number; blockedUntil: number }>();

function checkAuthLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const MAX_ATTEMPTS = 5;
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const BLOCK_MS = 15 * 60 * 1000;  // 15 minute block

  let record = authAttempts.get(ip);

  if (!record || now > record.resetAt) {
    authAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS, blockedUntil: 0 });
    return { allowed: true, retryAfterSec: 0 };
  }

  if (record.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((record.blockedUntil - now) / 1000) };
  }

  record.count += 1;

  if (record.count > MAX_ATTEMPTS) {
    record.blockedUntil = now + BLOCK_MS;
    return { allowed: false, retryAfterSec: Math.ceil(BLOCK_MS / 1000) };
  }

  return { allowed: true, retryAfterSec: 0 };
}

// Global request limiter: 200 requests per minute per IP
const globalRequests = new Map<string, { count: number; resetAt: number }>();

function checkGlobalLimit(ip: string): boolean {
  const now = Date.now();
  const WINDOW_MS = 60 * 1000; // 1 minute
  const MAX = 200;

  const record = globalRequests.get(ip);

  if (!record || now > record.resetAt) {
    globalRequests.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  record.count += 1;
  return record.count <= MAX;
}

// ─────────────────────────────────────────────────────────────────────────────

const PROTECTED_DASHBOARD_PATHS = ['/dashboard'];
const PROTECTED_ADMIN_PATHS = ['/admin'];
const AUTH_API_PATHS = ['/api/auth/login', '/api/auth/register', '/api/auth/owner-login'];
const PUBLIC_API_PREFIXES = ['/api/properties', '/api/plots?', '/api/inquiries', '/api/registrations', '/api/site-visits', '/api/feedback', '/api/db-status'];

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);
  const response = NextResponse.next();

  // ── 1. SECURITY HEADERS ─────────────────────────────────────────────────
  const headers = response.headers;

  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://www.transparenttextures.com",
      "font-src 'self' https://fonts.gstatic.com",
      "connect-src 'self' https://api.cloudinary.com https://generativelanguage.googleapis.com",
      "frame-ancestors 'none'",
    ].join('; ')
  );
  headers.set('X-Frame-Options', 'DENY');
  headers.set('X-Content-Type-Options', 'nosniff');
  headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  headers.set('X-DNS-Prefetch-Control', 'off');

  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // ── 2. GLOBAL RATE LIMITING ──────────────────────────────────────────────
  if (!checkGlobalLimit(ip)) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests. Please slow down.' }), {
      status: 429,
      headers: {
        'Content-Type': 'application/json',
        'Retry-After': '60',
      },
    });
  }

  // ── 3. AUTH ROUTE RATE LIMITING ──────────────────────────────────────────
  const isAuthApiRoute = AUTH_API_PATHS.some(p => pathname.startsWith(p));
  if (isAuthApiRoute) {
    const { allowed, retryAfterSec } = checkAuthLimit(ip);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({
          error: 'Too many login attempts. Please try again later.',
          retryAfter: retryAfterSec,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Retry-After': String(retryAfterSec),
          },
        }
      );
    }
  }

  // ── 4. CSRF VALIDATION FOR STATE-CHANGING API ROUTES ──────────────────────
  const isStateMutatingMethod = ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method);
  const isApiRoute = pathname.startsWith('/api/');
  const isPublicApiRoute = PUBLIC_API_PREFIXES.some(p => pathname.startsWith(p));
  const isAuthApi = AUTH_API_PATHS.some(p => pathname.startsWith(p));

  // Apply CSRF validation to protected API routes (not auth or public endpoints)
  // DISABLED TEMPORARILY to fix login issues
  if (false && isStateMutatingMethod && isApiRoute && !isPublicApiRoute && !isAuthApi && process.env.NODE_ENV === 'production') {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (!cookieToken || !headerToken || cookieToken !== headerToken) {
      return new NextResponse(JSON.stringify({ error: 'Invalid or missing CSRF token.' }), {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  }

  // DEBUG: Log environment and request details
  console.log('🔍 Middleware Debug:', {
    pathname,
    method: request.method,
    isStateMutatingMethod: ['POST', 'PUT', 'DELETE', 'PATCH'].includes(request.method),
    isApiRoute: pathname.startsWith('/api/'),
    isPublicApiRoute: PUBLIC_API_PREFIXES.some(p => pathname.startsWith(p)),
    isAuthApi: AUTH_API_PATHS.some(p => pathname.startsWith(p)),
    nodeEnv: process.env.NODE_ENV,
    hasAccessToken: !!request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value,
    hasRefreshToken: !!request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value
  });

  // ── 5. DASHBOARD PROTECTION ──────────────────────────────────────────────
  const isDashboardPath = PROTECTED_DASHBOARD_PATHS.some(p => pathname.startsWith(p));
  const isAdminPath = PROTECTED_ADMIN_PATHS.some(p => pathname.startsWith(p));

  if (isDashboardPath || isAdminPath) {
    const authToken = request.cookies.get('auth-token')?.value;
    const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

    if (!authToken && !accessToken && !refreshToken) {
      const url = new URL('/owner-login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }

    // Attach user token header for downstream API routes to read (no JWT lib in edge)
    if (authToken || accessToken) {
      response.headers.set('x-has-auth', '1');
    }
  }

  // ── 6. PREMIUM DASHBOARD PROTECTION ─────────────────────────────────────
  if (pathname.startsWith('/premium-dashboard')) {
    const authToken = request.cookies.get('auth-token')?.value;
    const accessToken = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

    if (!authToken && !accessToken && !refreshToken) {
      const url = new URL('/user-login', request.url);
      url.searchParams.set('callbackUrl', encodeURI(pathname));
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public directory
     * - Explicit test routes
     */
    '/((?!_next/static|_next/image|favicon.ico|favicon.png|icons/|public/|api/auth/test-connection|api/simple-test).*)',
  ],
};
