export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/auth';
import { handleError } from '@/lib/errors';
import { sanitizeInput, validateEmail, globalRateLimiter } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting for user creation
    const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    if (!globalRateLimiter.isAllowed(`create-user:${clientIP}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many user creation attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password, role = 'User' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Validate role
    if (!['User', 'Owner', 'Premium'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be User, Owner, or Premium.' },
        { status: 400 }
      );
    }

    // Create user with provided password
    const user = await registerUser({
      email: sanitizedEmail,
      password: sanitizeInput(password),
      role
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}