import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, setAuthCookies } from '@/lib/auth';
import { AUTH_COOKIES } from '@/lib/constants';
import { readUsers } from '@/lib/mongodb-database';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;

    if (!refreshToken) {
      return NextResponse.json({ error: 'Refresh token missing' }, { status: 401 });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: 'Invalid refresh token' }, { status: 401 });
    }

    // Optional: check if user still exists and is not disabled
    const users = await readUsers();
    const user = users.find(u => u.id === decoded.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    // Set new cookies (rotates both access and refresh tokens)
    await setAuthCookies({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Refresh token error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
