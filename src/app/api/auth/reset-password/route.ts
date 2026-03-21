export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/mongodb-database';
import { setPassword } from '@/lib/password-storage';
import { validatePasswordStrength } from '@/lib/enhanced-auth';
import { handleError } from '@/lib/errors';
import { sanitizeInput, validateEmail, globalRateLimiter } from '@/lib/security';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  let body;
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';

    body = await request.json();
    const { email, securityAnswer, newPassword } = body;

    logger.info(`🔐 RESET PASSWORD ATTEMPT: ${email} from IP: ${clientIP}`);

    if (!email || !securityAnswer || !newPassword) {
      logger.warn(`❌ Reset failed: Missing fields for ${email}`);
      return NextResponse.json(
        { error: 'Email, security answer, and new password are required' },
        { status: 400 }
      );
    }

    // Rate limiting for password reset
    if (!globalRateLimiter.isAllowed(`reset-password:${clientIP}`, 5, 60 * 60 * 1000)) {
      logger.warn(`❌ Reset failed: Rate limited for IP ${clientIP}`);
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { status: 429 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedAnswer = sanitizeInput(securityAnswer);
    const sanitizedPassword = sanitizeInput(newPassword);

    // Validate email
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      logger.warn(`❌ Reset failed: Invalid email format ${sanitizedEmail}`);
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check if user exists
    logger.info(`🔍 Looking up user: ${sanitizedEmail}`);
    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === sanitizedEmail.toLowerCase());
    if (!user) {
      logger.warn(`❌ Reset failed: User not found ${sanitizedEmail}`);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify security answer (hardcoded for now - in production, store per user)
    logger.info(`🔍 Verifying security answer for: ${sanitizedEmail}`);
    if (sanitizedAnswer.toLowerCase() !== 'mani') {
      logger.warn(`❌ Reset failed: Incorrect security answer for ${sanitizedEmail}`);
      return NextResponse.json(
        { error: 'Incorrect security answer' },
        { status: 400 }
      );
    }

    // Validate new password strength
    logger.info(`🔍 Validating password strength for: ${sanitizedEmail}`);
    const passwordValidation = validatePasswordStrength(sanitizedPassword);
    if (!passwordValidation.isValid) {
      const feedback = passwordValidation.feedback.join(', ');
      logger.warn(`❌ Reset failed: Weak password for ${sanitizedEmail}: ${feedback}`);
      return NextResponse.json(
        { 
          error: `Password is too weak: ${feedback}`,
          feedback: passwordValidation.feedback
        },
        { status: 400 }
      );
    }

    // Hash and store new password
    logger.info(`💾 Hashing and storing new password for: ${sanitizedEmail}`);
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 12);
    await setPassword(user.email, hashedPassword);

    logger.info(`✅ Password reset successful for: ${sanitizedEmail}`);
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    logger.error(`💥 CRITICAL RESET ERROR:`, { error: errorMsg, email: body?.email });
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}