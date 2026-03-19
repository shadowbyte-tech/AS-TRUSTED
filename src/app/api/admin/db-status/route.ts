import { NextResponse } from 'next/server';
import { getDBStatus } from '@/lib/mongodb-database';

export async function GET() {
  try {
    const status = await getDBStatus();
    return NextResponse.json(status);
  } catch (error) {
    return NextResponse.json(
      { 
        connected: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}
