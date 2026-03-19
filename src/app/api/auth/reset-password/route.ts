import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/mongodb-database';
import { setPassword } from '@/lib/password-storage';
import { validatePasswordStrength } from '@/lib/enhanced-auth';
import { handleError } from '@/lib/errors';
import { sanitizeInput, validateEmail, globalRateLimiter } from '@/lib/security';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for password reset
    const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    if (!globalRateLimiter.isAllowed(`reset-password:${clientIP}`, 3, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many password reset attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, securityAnswer, newPassword } = body;

    if (!email || !securityAnswer || !newPassword) {
      return NextResponse.json(
        { error: 'Email, security answer, and new password are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedAnswer = sanitizeInput(securityAnswer);
    const sanitizedPassword = sanitizeInput(newPassword);

    // Validate email
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check if user exists
    const users = await readUsers();
    const user = users.find(u => u.email.toLowerCase() === sanitizedEmail.toLowerCase());
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Verify security answer (hardcoded for now - in production, store per user)
    if (sanitizedAnswer.toLowerCase() !== 'mani') {
      return NextResponse.json(
        { error: 'Incorrect security answer' },
        { status: 400 }
      );
    }

    // Validate new password strength
    const passwordValidation = validatePasswordStrength(sanitizedPassword);
    if (!passwordValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Password does not meet security requirements',
          feedback: passwordValidation.feedback
        },
        { status: 400 }
      );
    }

    // Hash and store new password
    const hashedPassword = await bcrypt.hash(sanitizedPassword, 12);
    await setPassword(user.email, hashedPassword);

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}