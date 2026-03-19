export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

// Simple user database for testing
const users = [
  { id: '1', email: 'admin@astrustedconsultancy.com', password: 'admin123', role: 'Owner' },
  { id: '2', email: 'mani@consult.com', password: 'mani123', role: 'User' },
  { id: '3', email: 'premium@astrustedconsultancy.com', password: 'premium123', role: 'Premium' }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Login API called');
    
    const body = await request.json();
    const { email, password } = body;
    
    console.log('🔍 Login attempt:', { email, passwordLength: password?.length });

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!user) {
      console.log('🔍 User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check password (plain text for now)
    if (user.password !== password) {
      console.log('🔍 Password mismatch for:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('🔍 Login successful for:', email);

    // Set simple session cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });

    // Set a simple auth cookie
    response.cookies.set('auth', 'true', {
      httpOnly: true,
      secure: false, // For development
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('❌ Login API error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
