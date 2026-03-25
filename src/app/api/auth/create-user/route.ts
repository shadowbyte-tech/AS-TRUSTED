export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // This endpoint is deprecated - use the server action instead
  return NextResponse.json({
    error: 'This endpoint is deprecated. Please use the server action instead.',
    message: 'Create user functionality has been moved to server actions.'
  }, { status: 410 }); // 410 Gone
}