/**
 * @file src/app/api/auth/logout/route.ts
 */
import { NextRequest, NextResponse } from 'next/server';
import { clearAuthCookies, getSessionUser } from '@/lib/auth';
import { connectDB, User } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (sessionUser) {
      await connectDB();
      await User.findByIdAndUpdate(sessionUser.id, { refreshToken: null });
    }
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  } catch {
    await clearAuthCookies();
    return NextResponse.json({ success: true });
  }
}
