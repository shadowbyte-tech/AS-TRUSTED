export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { generatePasswordOptions, validatePasswordStrength } from '@/lib/enhanced-auth';
import { getSessionUser } from '@/lib/auth';
import { handleError } from '@/lib/errors';

export async function POST() {
  try {
    // Check authentication and authorization
    const sessionUser = getSessionUser();
    if (!(sessionUser as any)?.role || (sessionUser as any)?.role !== 'Owner') {
      return NextResponse.json(
        { error: 'Unauthorized. Only owners can generate passwords.' },
        { status: 403 }
      );
    }

    const request = (globalThis as any).request as NextRequest;
    const body = await request.json();
    const { count = 3, options = {} } = body;

    // Generate password options
    const passwords = generatePasswordOptions(Math.min(count, 5)); // Limit to 5 options max

    // Validate each password and return with strength info
    const passwordsWithStrength = passwords.map(password => {
      const strength = validatePasswordStrength(password);
      return {
        password,
        strength: strength.strength,
        score: strength.score,
        isValid: strength.isValid
      };
    });

    return NextResponse.json({
      success: true,
      passwords: passwordsWithStrength,
    });
  } catch (error) {
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication and authorization
    const sessionUser = getSessionUser();
    if (!(sessionUser as any)?.role || (sessionUser as any)?.role !== 'Owner') {
      return NextResponse.json(
        { error: 'Unauthorized. Only owners can generate passwords.' },
        { status: 403 }
      );
    }

    // Generate a single password with default options
    const passwords = generatePasswordOptions(1);
    const password = passwords[0];
    const strength = validatePasswordStrength(password);

    return NextResponse.json({
      success: true,
      password,
      strength: {
        strength: strength.strength,
        score: strength.score,
        isValid: strength.isValid,
        feedback: strength.feedback
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