/**
 * @file src/app/api/auth/reset-password/route.ts
 * Password reset via security question — MongoDB-backed.
 * Used by the login form "Forgot Password?" flow.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';
import { logger } from '@/lib/logger';

const SECURITY_ANSWER = 'mani'; // matches login-form.tsx check

export async function POST(request: NextRequest) {
  try {
    const { email, securityAnswer, newPassword } = await request.json();

    if (!email || !securityAnswer || !newPassword) {
      return NextResponse.json(
        { error: 'Email, security answer, and new password are required.' },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'New password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // Validate security answer (case-insensitive)
    if (securityAnswer.trim().toLowerCase() !== SECURITY_ANSWER) {
      return NextResponse.json(
        { error: 'Incorrect security answer.' },
        { status: 403 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.trim().toLowerCase() }).lean();
    if (!user) {
      // Generic message — don't reveal whether email exists
      return NextResponse.json(
        { error: 'Incorrect security answer.' },
        { status: 403 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 12);
    await Password.findOneAndUpdate(
      { email: email.trim().toLowerCase() },
      { hashedPassword },
      { upsert: true }
    );

    logger.info(`✅ Password reset via security question for: ${email}`);
    return NextResponse.json({ success: true, message: 'Password reset successfully. Please log in.' });

  } catch (error) {
    logger.error('reset-password error', error);
    return NextResponse.json({ error: 'Failed to reset password.' }, { status: 500 });
  }
}
