import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Correctly extracts and verifies the session from JWT cookies
    const user = await getSessionUser();
    
    if (!user) {
      return NextResponse.json({ 
        user: null 
      });
    }

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || user.email.split('@')[0]
      }
    });

  } catch (error) {
    console.error('Error in /api/auth/me:', error);
    return NextResponse.json({ 
      user: null 
    });
  }
}
