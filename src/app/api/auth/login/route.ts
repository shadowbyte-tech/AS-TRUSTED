/**
 * @file src/app/api/auth/login/route.ts
 * Login endpoint — MongoDB + bcrypt + JWT. Cookie set via response.
 */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';
import { generateAccessToken } from '@/lib/auth';
import { AUTH_COOKIES } from '@/lib/constants';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 LOGIN START');

    const body = await request.json();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    console.log('📧 Email:', email);

    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    await connectDB();
    console.log('✅ DB Connected');

    const user = await User.findOne({ email }).lean();
    console.log('👤 User Found:', !!user, '| Active:', user?.isActive, '| Blocked:', user?.isBlocked);

    // isActive===undefined means old doc created before the field existed — treat as active
    if (!user || user.isActive === false || user.isBlocked === true) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const passwordDoc = await Password.findOne({ email }).lean();
    console.log('🔑 Password Doc Found:', !!passwordDoc, '| Hash present:', !!passwordDoc?.hashedPassword);

    if (!passwordDoc?.hashedPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('🔒 Comparing password...');
    const isValid = await bcrypt.compare(password, passwordDoc.hashedPassword);
    console.log('✅ Password Match:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Use the same token generator as the rest of the codebase
    const authUser = {
      id:    String(user._id),
      email: user.email,
      role:  user.role,
      name:  user.name,
    };

    const token = generateAccessToken(authUser);
    console.log('🎉 LOGIN SUCCESS — role:', user.role);

    // Update last login
    await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: authUser,
    });

    response.cookies.set(AUTH_COOKIES.ACCESS_TOKEN, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',         // ← changed from 'strict' to 'lax' for compatibility
      maxAge: AUTH_COOKIES.MAX_AGE_ACCESS,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
