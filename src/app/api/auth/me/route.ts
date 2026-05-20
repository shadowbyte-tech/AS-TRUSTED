/**
 * @file src/app/api/auth/me/route.ts
 * Returns current session user from JWT cookie. MongoDB-backed.
 */
import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { cookies } from 'next/headers';
import { AUTH_COOKIES } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Debug: check what cookies exist on this request
    const cookieStore = await cookies();
    const rawToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
    console.log('🍪 /api/auth/me — cookie present:', !!rawToken);
    console.log('🍪 token prefix:', rawToken?.substring(0, 20));

    const user = await getSessionUser();
    console.log('👤 /api/auth/me — user resolved:', user ? `${user.email} (${user.role})` : 'null');

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
  } catch (err) {
    console.error('🔥 /api/auth/me error:', err);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
