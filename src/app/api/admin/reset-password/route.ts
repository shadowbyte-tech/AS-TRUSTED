import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { userId, newPassword } = await request.json();

    if (!userId || !newPassword || newPassword.length < 8) {
      return NextResponse.json({ error: 'userId and newPassword (min 8 chars) are required' }, { status: 400 });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Password.findOneAndUpdate(
      { email: user.email },
      { hashedPassword },
      { upsert: true }
    );

    logger.info(`✅ Password reset for: ${user.email}`);
    return NextResponse.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    logger.error('reset-password failed', err);
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
}
