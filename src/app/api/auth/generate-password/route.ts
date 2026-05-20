/**
 * @file src/app/api/auth/generate-password/route.ts
 * Admin: create/reset a user's password — owner-only, MongoDB-backed.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword || newPassword.length < 8) {
      return NextResponse.json(
        { error: 'email and newPassword (min 8 chars) are required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.trim().toLowerCase() }).lean();
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Password.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { hashedPassword },
      { upsert: true }
    );

    logger.info(`✅ Password generated/reset by admin for: ${email}`);
    return NextResponse.json({ success: true, message: 'Password set successfully.' });

  } catch (error) {
    logger.error('generate-password error', error);
    return NextResponse.json({ error: 'Failed to set password.' }, { status: 500 });
  }
}