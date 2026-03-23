import { NextRequest, NextResponse } from 'next/server';
import { getPlots } from '@/lib/supabase-actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
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
      error: error.message
    }, { status: 500 });
  }
}
