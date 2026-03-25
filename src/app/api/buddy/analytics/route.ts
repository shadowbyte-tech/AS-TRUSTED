export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Buddy analytics placeholder
    return NextResponse.json({
      message: 'Buddy analytics not yet implemented in Supabase',
      status: 'placeholder',
      data: []
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      error: 'Failed to fetch buddy analytics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
