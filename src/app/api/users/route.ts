/**
 * @file src/app/api/users/route.ts
 * Users endpoint — owner-only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const users = await User.find({})
      .select('-refreshToken')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, data: users, count: users.length });
  } catch (err) {
    logger.error('GET /api/users failed', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
