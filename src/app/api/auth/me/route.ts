/**
 * @file src/app/api/auth/me/route.ts
 * Returns current session user from JWT cookie. MongoDB-backed.
 */
import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const user = await getSessionUser();

    if (!user) {
      return NextResponse.json({ user: null }, { status: 401 });
    }
    return NextResponse.json({
      user: {
        id:    user.id,
        email: user.email,
        role:  user.role,
        name:  user.name || user.email.split('@')[0],
        phone: user.phone,
      },
    });
  } catch {
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
