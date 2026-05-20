import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Password } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    const user = await User.findById(userId).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    await Password.findOneAndDelete({ email: user.email });
    await User.findByIdAndDelete(userId);

    logger.info(`✅ User deleted: ${user.email}`);
    return NextResponse.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    logger.error('delete-user failed', err);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}
