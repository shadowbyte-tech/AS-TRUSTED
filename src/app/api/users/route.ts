import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/supabase-actions';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const users = await getUsers();
    
    return NextResponse.json({
      success: true,
      data: users,
      count: users.length
    });
    
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
