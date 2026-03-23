import { NextRequest, NextResponse } from 'next/server';
import { getRegistrations } from '@/lib/supabase-actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const registrations = await getRegistrations();
    
    return NextResponse.json({
      success: true,
      data: registrations,
      count: registrations.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching registrations:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
