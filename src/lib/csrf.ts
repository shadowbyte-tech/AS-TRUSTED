/**
 * CSRF Protection Utilities
 * Double-Submit Cookie Pattern (Stateless, works in serverless/edge)
 *
 * This implementation uses the Web Crypto API for Edge Runtime compatibility.
 */

import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export const CSRF_COOKIE_NAME = 'astc_csrf_token';
export const CSRF_HEADER_NAME = 'x-csrf-token';

/**
 * Helper: Converts a Uint8Array to a hex string
 */
function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Generates a cryptographically secure CSRF token (Edge Compatible)
 */
export function generateCsrfToken(): string {
  const array = new Uint8Array(32);
  // Using globalThis.crypto for broad compatibility
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array);
  } else {
    // Basic fallback for non-crypto environments (should not be reached in modern browsers/Next.js)
    for (let i = 0; i < 32; i++) array[i] = Math.floor(Math.random() * 256);
  }
  return toHex(array);
}

/**
 * Sets the CSRF token cookie on a response.
 */
export function setCsrfCookie(response: NextResponse): string {
  const token = generateCsrfToken();
  response.cookies.set(CSRF_COOKIE_NAME, token, {
    httpOnly: false, // Must be readable by JavaScript
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60, // 1 hour
  });
  return token;
}

/**
 * Constant-time comparison to prevent timing attacks (Edge Compatible)
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

/**
 * Validates a CSRF token from an incoming API request.
 */
export function validateCsrfToken(request: NextRequest): boolean {
  if (['GET', 'HEAD', 'OPTIONS'].includes(request.method)) {
    return true;
  }

  const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
  const headerToken = request.headers.get(CSRF_HEADER_NAME);

  if (!cookieToken || !headerToken) return false;

  return timingSafeEqual(cookieToken, headerToken);
}

/**
 * Gets the current CSRF token from the cookie store (server-side).
 */
export async function getServerCsrfToken(): Promise<string | undefined> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(CSRF_COOKIE_NAME)?.value;
  } catch {
    return undefined;
  }
}
