export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, Password } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    const newHash = await bcrypt.hash(newPassword, 12);

    await connectDB();
    await Password.findOneAndUpdate(
      { email: email.toLowerCase() },
      { hashedPassword: newHash },
      { upsert: true }
    );

    logger.info(`✅ Password updated for: ${email}`);
    return NextResponse.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    logger.error('update-owner-password error', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}