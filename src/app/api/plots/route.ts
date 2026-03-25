export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getPlots } from '@/lib/supabase-actions';

export async function GET() {
  try {
    const plots = await getPlots();
    
    return NextResponse.json({
      success: true,
      data: plots,
      count: plots.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching plots:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
