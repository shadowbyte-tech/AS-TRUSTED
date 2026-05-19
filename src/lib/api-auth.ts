/**
 * @file src/lib/api-auth.ts
 * API Route Authorization Helpers — JWT from cookie (auth_access_token).
 */
import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './auth';
import { AUTH_COOKIES } from './constants';

export interface DecodedToken {
  id:    string;
  email: string;
  role:  string;
}

export function getTokenFromRequest(request: NextRequest): DecodedToken | null {
  const token = request.cookies.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  if (!token) return null;
  const decoded = verifyToken(token);
  if (!decoded?.id) return null;
  return decoded as DecodedToken;
}

export async function requireAuth(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Authentication required. Please log in.' }, { status: 401 });
  }
  return null;
}

export async function requireOwner(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (decoded.role !== 'Owner') {
    return NextResponse.json({ error: 'Access denied. Owner privileges required.' }, { status: 403 });
  }
  return null;
}

export async function requirePremium(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (!['Premium', 'Elite', 'Owner'].includes(decoded.role)) {
    return NextResponse.json({ error: 'Premium subscription required.' }, { status: 403 });
  }
  return null;
}

export async function requireElite(request: NextRequest): Promise<NextResponse | null> {
  const decoded = getTokenFromRequest(request);
  if (!decoded) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }
  if (!['Elite', 'Owner'].includes(decoded.role)) {
    return NextResponse.json({ error: 'Elite membership required.' }, { status: 403 });
  }
  return null;
}
