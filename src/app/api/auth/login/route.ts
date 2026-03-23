import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/supabase-auth';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    const { data, error } = await signIn(email, password);
    
    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message
      });
    }
    
    return NextResponse.json({
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email,
        role: data.user?.user_metadata?.role || 'User',
        name: data.user?.user_metadata?.name || data.user?.email
      }
    });
    
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
