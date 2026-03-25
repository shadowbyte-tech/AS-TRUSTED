export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();

    // Property view tracking functionality would need to be implemented in Supabase
    return NextResponse.json({
      message: 'Property view tracking not yet implemented in Supabase',
      status: 'placeholder'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      error: 'Failed to track property view',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}