/**
 * @file src/app/api/auth/login/route.ts
 * Login endpoint — MongoDB + bcrypt. No hardcoded credentials.
 */
import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setAuthCookies } from '@/lib/auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await authenticateUser({ email: email.trim().toLowerCase(), password });

    if (!user) {
      // Generic message — do not reveal whether email exists
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }

    const { accessToken } = await setAuthCookies(user);

    logger.info(`✅ Login successful: ${user.email} (${user.role})`);

    return NextResponse.json({
      success: true,
      user: {
        id:    user.id,
        email: user.email,
        role:  user.role,
        name:  user.name,
      },
    });
  } catch (err) {
    logger.error('Login error', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
