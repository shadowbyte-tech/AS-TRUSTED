export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { registerUser, setAuthCookies } from '@/lib/auth';
import { handleError, ValidationError } from '@/lib/errors';
import { API_MESSAGES, VALIDATION } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, role } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: API_MESSAGES.ERROR.MISSING_FIELDS, fields: ['email', 'password'] },
        { status: 400 }
      );
    }

    if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long` },
        { status: 400 }
      );
    }

    const user = await registerUser({ email, password, name, role });
    
    if (!user) {
      return NextResponse.json(
        { error: API_MESSAGES.ERROR.USER_EXISTS },
        { status: 409 }
      );
    }

    // Set secure HTTP-only cookies
    await setAuthCookies(user);

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
