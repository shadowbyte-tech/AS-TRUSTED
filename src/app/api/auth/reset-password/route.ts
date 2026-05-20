/**
 * Public password reset is intentionally disabled until an email-verified,
 * single-use reset-token flow is configured.
 */
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: 'Public password reset is temporarily disabled. Please contact the owner for account recovery.',
    },
    { status: 410 }
  );
}
