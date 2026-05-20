import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const VALID_ROLES = ['Owner', 'User', 'Premium', 'Elite'];

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { userId, newRole } = await request.json();

    if (!userId || !newRole || !VALID_ROLES.includes(newRole)) {
      return NextResponse.json({ error: `userId and newRole (${VALID_ROLES.join('|')}) are required` }, { status: 400 });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role: newRole, refreshTokenHash: null },
      { new: true }
    ).select('-refreshTokenHash -passwordResetTokenHash').lean();

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.info(`✅ Role updated: ${user.email} → ${newRole}`);
    return NextResponse.json({
      success: true,
      user: { ...user, id: String(user._id), _id: String(user._id) },
      message: `Role updated to ${newRole}`,
    });
  } catch (err) {
    logger.error('update-user-role failed', err);
    return NextResponse.json({ error: 'Failed to update role' }, { status: 500 });
  }
}
