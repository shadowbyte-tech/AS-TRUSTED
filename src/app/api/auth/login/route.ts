import { NextRequest, NextResponse } from 'next/server';
import { getUsers } from '@/lib/supabase-actions';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Login attempt:', email);

    // Get user from our custom users table
    const users = await getUsers();
    const user = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return NextResponse.json({
        success: false,
        error: 'User not found'
      });
    }

    // Simple password check for admin user (since we don't have password storage yet)
    if (email === 'admin@astrustedconsultancy.com' && password === 'admin123') {
      // Create JWT token
      const token = jwt.sign(
        {
          id: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Set HTTP-only cookie
      const response = NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          name: user.name
        }
      });

      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      });

      console.log('✅ Login successful for:', email);
      return response;
    } else {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
