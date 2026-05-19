import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { userId, action } = await request.json();

    if (!userId || !['block', 'unblock'].includes(action)) {
      return NextResponse.json({ error: 'userId and action (block/unblock) are required' }, { status: 400 });
    }

    const isBlocked = action === 'block';
    const user = await User.findByIdAndUpdate(
      userId,
      { isBlocked, isActive: !isBlocked },
      { new: true }
    ).select('-refreshToken').lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.info(`✅ User ${action}ed: ${user.email}`);
    return NextResponse.json({ success: true, user, message: `User ${action}ed successfully` });
  } catch (err) {
    logger.error('block-user failed', err);
    return NextResponse.json({ error: 'Failed to process user action' }, { status: 500 });
  }
}
