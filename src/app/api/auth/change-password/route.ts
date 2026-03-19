import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser, changePassword } from '@/lib/auth';
import { handleError } from '@/lib/errors';
import { API_MESSAGES, VALIDATION } from '@/lib/constants';

export async function POST(request: NextRequest) {
  try {
    const user = getSessionUser();
    
    if (!user) {
      return NextResponse.json(
        { error: API_MESSAGES.ERROR.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: API_MESSAGES.ERROR.MISSING_FIELDS, fields: ['currentPassword', 'newPassword'] },
        { status: 400 }
      );
    }

    if (newPassword.length < VALIDATION.PASSWORD_MIN_LENGTH) {
      return NextResponse.json(
        { error: `New password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long` },
        { status: 400 }
      );
    }

    await changePassword((user as any)?.id || '', currentPassword, newPassword);

    return NextResponse.json({
      success: true,
      message: API_MESSAGES.SUCCESS.PASSWORD_CHANGED,
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
