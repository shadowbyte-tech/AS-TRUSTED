/**
 * API Route Authorization Helpers
 * Reusable auth guards for Next.js API routes.
 *
 * Usage:
 *   import { requireOwner, requireAuth } from '@/lib/api-auth';
 *
 *   export async function POST(request: NextRequest) {
 *     const authError = await requireOwner(request);
 *     if (authError) return authError;
 *     // ... proceed with owner-only logic
 *   }
 */

import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { AUTH_COOKIES } from './constants';

export interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

/**
 * Extracts and verifies the JWT token from the request cookies.
 * Returns the decoded token payload or null.
 */
export function getTokenFromRequest(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) return null;

  return decoded as DecodedToken;
}

/**
 * Requires ANY authenticated user. Rejects unauthenticated requests.
 * Returns NextResponse (error) if unauthorized, null if allowed.
 */
export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Authentication required. Please log in.' },
      { status: 401 }
    );
  }
  return null;
}

/**
 * Requires the user to have the 'Owner' role.
 * Returns NextResponse (error) if not owner, null if allowed.
 */
export async function requireOwner(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 }
    );
  }
  if (decoded.role !== 'Owner') {
    return NextResponse.json(
      { error: 'Access denied. Owner privileges required.' },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Requires the user to have 'Premium' or 'Owner' role.
 * Returns NextResponse (error) if not allowed, null if allowed.
 */
export async function requirePremium(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json(
      { error: 'Authentication required.' },
      { status: 401 }
    );
  }
  if (!['Premium', 'Elite', 'Owner'].includes(decoded.role)) {
    return NextResponse.json(
      { error: 'Premium subscription required to access this feature.' },
      { status: 403 }
    );
  }
  return null;
}

/**
 * Requires the user to have 'Elite' or 'Owner' role.
 */
export async function requireElite(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (!['Elite', 'Owner'].includes(decoded.role)) {
    return NextResponse.json(
      { error: 'Elite membership required for this feature.' },
      { status: 403 }
    );
  }
  return null;
}
