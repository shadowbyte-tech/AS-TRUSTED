/**
 * @file src/app/api/users/route.ts
 * Users endpoint — owner-only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Password, User } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const users = await User.find({})
      .select('-refreshTokenHash -passwordResetTokenHash')
      .sort({ createdAt: -1 })
      .lean();

    // Return only safe user data — no password hashes exposed to browser
    const usersWithSafeData = users.map((u: any) => ({
      ...u,
      id: String(u._id),
      _id: String(u._id),
      blocked: u.isBlocked === true,
      lastLogin: u.lastLoginAt,
      // passwordHash intentionally omitted for security
    }));

    return NextResponse.json({ success: true, data: usersWithSafeData, count: usersWithSafeData.length });
  } catch (err) {
    logger.error('GET /api/users failed', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
