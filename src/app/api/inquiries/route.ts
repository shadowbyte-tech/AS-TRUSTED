import { NextRequest, NextResponse } from 'next/server';
import { getInquiries } from '@/lib/supabase-actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const inquiries = await getInquiries();
    
    return NextResponse.json({
      success: true,
      data: inquiries,
      count: inquiries.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching inquiries:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
