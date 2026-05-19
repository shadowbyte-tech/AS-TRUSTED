/**
 * @file src/app/api/auth/register/route.ts
 * User registration — MongoDB only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { registerUser, setAuthCookies } from '@/lib/auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (typeof email !== 'string' || typeof password !== 'string') {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

    const user = await registerUser({
      email: email.trim().toLowerCase(),
      password,
      name: name?.trim(),
      role: 'User',
    });

    await setAuthCookies(user);

    logger.info(`✅ User registered: ${user.email}`);

    return NextResponse.json({
      success: true,
      user: {
        id:    user.id,
        email: user.email,
        role:  user.role,
        name:  user.name,
      },
    }, { status: 201 });
  } catch (err: any) {
    const message = err?.message || 'Registration failed';
    const isConflict = message.includes('already exists');
    return NextResponse.json({ error: message }, { status: isConflict ? 409 : 500 });
  }
}
