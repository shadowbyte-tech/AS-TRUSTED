import { NextRequest, NextResponse } from 'next/server';
import { getDBStatus } from '@/lib/mongodb-database';

export async function GET(request: NextRequest) {
  try {
    const status = await getDBStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : String(error),
      type: 'Error'
    }, { status: 500 });
  }
}
