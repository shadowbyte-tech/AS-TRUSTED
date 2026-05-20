export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { hashToken, setAuthCookies, verifyToken } from '@/lib/auth';
import { connectDB, User } from '@/lib/models';
import { AUTH_COOKIES } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get(AUTH_COOKIES.REFRESH_TOKEN)?.value;
    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const decoded = verifyToken(refreshToken);
    if (!decoded?.id) {
      return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(decoded.id).select('+refreshTokenHash').lean();
    if (!user || user.isActive === false || user.isBlocked === true) {
      return NextResponse.json({ error: 'User not found or disabled' }, { status: 401 });
    }

    if (!user.refreshTokenHash || user.refreshTokenHash !== hashToken(refreshToken)) {
      return NextResponse.json({ error: 'User not found or disabled' }, { status: 401 });
    }

    const authUser = { id: String(user._id), email: user.email, role: user.role, name: user.name };
    await setAuthCookies(authUser);

    return NextResponse.json({ success: true, user: { id: authUser.id, email: authUser.email, role: authUser.role, name: authUser.name } });
  } catch (error) {
    console.error('Refresh error:', error);
    return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
  }
}
