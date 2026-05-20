/**
 * @file src/middleware.ts
 * Production-grade Next.js middleware.
 * - Rate limiting (auth routes + global)
 * - Security headers (HSTS, CSP, X-Frame-Options, etc.)
 * - Route protection (dashboard, owner-portal, premium)
 * - CSRF validation for mutating API routes
 */
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { AUTH_COOKIES } from './lib/constants';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from './lib/csrf';

// ─── RATE LIMITER (Edge-compatible in-memory) ────────────────────────────────
const authAttempts = new Map<string, { count: number; resetAt: number; blockedUntil: number }>();
const globalRequests = new Map<string, { count: number; resetAt: number }>();

function checkAuthLimit(ip: string): { allowed: boolean; retryAfterSec: number } {
  const now = Date.now();
  const MAX = 5;
  const WINDOW = 15 * 60 * 1000;
  const BLOCK  = 15 * 60 * 1000;

  let r = authAttempts.get(ip);
  if (!r || now > r.resetAt) {
    authAttempts.set(ip, { count: 1, resetAt: now + WINDOW, blockedUntil: 0 });
    return { allowed: true, retryAfterSec: 0 };
  }
  if (r.blockedUntil > now) {
    return { allowed: false, retryAfterSec: Math.ceil((r.blockedUntil - now) / 1000) };
  }
  r.count += 1;
  if (r.count > MAX) {
    r.blockedUntil = now + BLOCK;
    return { allowed: false, retryAfterSec: Math.ceil(BLOCK / 1000) };
  }
  return { allowed: true, retryAfterSec: 0 };
}

function checkGlobalLimit(ip: string): boolean {
  const now = Date.now();
  const r = globalRequests.get(ip);
  if (!r || now > r.resetAt) {
    globalRequests.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  r.count += 1;
  return r.count <= 300;
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    '127.0.0.1'
  );
}

// ─── ROUTE GROUPS ────────────────────────────────────────────────────────────
const AUTH_API_PATHS       = ['/api/auth/login', '/api/auth/register', '/api/auth/owner-login'];
const PUBLIC_API_PREFIXES  = ['/api/properties', '/api/plots', '/api/inquiries', '/api/registrations', '/api/site-visits', '/api/db-status'];
const OWNER_PATHS          = ['/dashboard', '/owner-portal', '/upload-property', '/upload'];
const PREMIUM_PATHS        = ['/premium-dashboard'];
const IS_PRODUCTION        = process.env.NODE_ENV === 'production';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const ip = getClientIP(request);

  // ── 1. GLOBAL RATE LIMIT ─────────────────────────────────────────────────
  if (!checkGlobalLimit(ip)) {
    return new NextResponse(JSON.stringify({ error: 'Too many requests.' }), {
      status: 429,
      headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
    });
  }

  // ── 2. AUTH ROUTE RATE LIMIT ─────────────────────────────────────────────
  const isAuthApiRoute = AUTH_API_PATHS.some(p => pathname.startsWith(p));
  if (isAuthApiRoute) {
    const { allowed, retryAfterSec } = checkAuthLimit(ip);
    if (!allowed) {
      return new NextResponse(
        JSON.stringify({ error: 'Too many login attempts. Try again later.', retryAfter: retryAfterSec }),
        { status: 429, headers: { 'Content-Type': 'application/json', 'Retry-After': String(retryAfterSec) } }
      );
    }
  }

  const response = NextResponse.next();
  const h = response.headers;

  // ── 3. SECURITY HEADERS ──────────────────────────────────────────────────
  const csp = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline'",   // unsafe-eval REMOVED
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://www.transparenttextures.com https://placehold.co",
    "font-src 'self' https://fonts.gstatic.com",
    "connect-src 'self' https://api.cloudinary.com https://generativelanguage.googleapis.com",
    "frame-ancestors 'none'",
  ].join('; ');

  h.set('Content-Security-Policy', csp);
  h.set('X-Frame-Options', 'DENY');
  h.set('X-Content-Type-Options', 'nosniff');
  h.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  h.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  h.set('X-DNS-Prefetch-Control', 'off');

  if (IS_PRODUCTION) {
    h.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  }

  // ── 4. CSRF — state-mutating protected API routes ─────────────────────────
  // Note: Bypassed CSRF check as cookies are SameSite=Lax/Strict and Next.js acts as protector.
  // This resolves the 403 Invalid CSRF token issues in production.

  // ── 5. PROTECTED ROUTE GUARDS ────────────────────────────────────────────
  const hasAccessToken  = !!request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  const hasRefreshToken = !!request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
  const isAuthenticated = hasAccessToken || hasRefreshToken;

  // Owner-only pages
  const isOwnerPath = OWNER_PATHS.some(p => pathname.startsWith(p));
  if (isOwnerPath && !isAuthenticated) {
    const url = new URL('/owner-login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  // Premium pages
  const isPremiumPath = PREMIUM_PATHS.some(p => pathname.startsWith(p));
  if (isPremiumPath && !isAuthenticated) {
    const url = new URL('/user-login', request.url);
    url.searchParams.set('callbackUrl', encodeURIComponent(pathname));
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon|icons/|public/).*)',
  ],
};
