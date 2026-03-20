import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser } from '@/lib/mongodb-auth';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🧪 Testing authentication with:', email);
    
    const user = await authenticateUser({ email, password });
    
    if (user) {
      return NextResponse.json({
        success: true,
        message: 'Authentication successful',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: 'Authentication failed - check credentials',
        timestamp: new Date().toISOString()
      });
    }
    
  } catch (error) {
    console.error('❌ Test auth failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
