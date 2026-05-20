/**
 * @file src/app/api/auth/login/route.ts
 * Login endpoint backed by MongoDB, bcrypt, HTTP-only JWT cookies, and
 * persistent failed-attempt lockout.
 */
import { NextRequest, NextResponse } from 'next/server';
import { AuthLockoutError, authenticateUser, setAuthCookies } from '@/lib/auth';
import { API_MESSAGES } from '@/lib/constants';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const user = await authenticateUser({ email, password });
    if (!user) {
      return NextResponse.json(
        { success: false, error: API_MESSAGES.ERROR.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    await setAuthCookies(user);

    logger.info('Login successful');

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user,
    });
  } catch (error) {
    if (error instanceof AuthLockoutError) {
      return NextResponse.json(
        { success: false, error: error.message, retryAfter: error.retryAfterSec },
        { status: 429, headers: { 'Retry-After': String(error.retryAfterSec) } }
      );
    }

    logger.error('Login failed', error);
    return NextResponse.json(
      { success: false, error: API_MESSAGES.ERROR.INTERNAL_ERROR },
      { status: 500 }
    );
  }
}
