import { NextRequest, NextResponse } from 'next/server';
import { getContacts } from '@/lib/supabase-actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const contacts = await getContacts();
    
    return NextResponse.json({
      success: true,
      data: contacts,
      count: contacts.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching contacts:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
