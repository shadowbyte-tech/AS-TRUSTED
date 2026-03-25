export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getPlots } from '@/lib/supabase-actions';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const plots = await getPlots();
    const plot = plots.find(p => p.id === params.id);

    if (!plot) {
      return NextResponse.json({
        success: false,
        error: 'Property not found'
      }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      data: plot
    });

  } catch (error) {
    console.error('❌ Error fetching property:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}