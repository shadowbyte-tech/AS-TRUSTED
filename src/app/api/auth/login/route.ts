import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB, User, Password } from '@/lib/models';

const JWT_SECRET = process.env.JWT_SECRET!;

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 LOGIN START');

    const body = await request.json();

    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    console.log('📧 Email:', email);

    if (!email || !password) {
      console.log('❌ Missing email or password');

      return NextResponse.json(
        { success: false, error: 'Email and password required' },
        { status: 400 }
      );
    }

    await connectDB();

    console.log('✅ DB Connected');

    // Find user
    const user = await User.findOne({ email });

    console.log('👤 User Found:', !!user);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Find password doc — MUST use .select('+hashedPassword') because schema has select:false
    const passwordDoc = await Password.findOne({ email }).select('+hashedPassword');

    console.log('🔑 Password Doc Found:', !!passwordDoc);

    if (!passwordDoc) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('🔒 Comparing password...');

    const isValid = await bcrypt.compare(
      password,
      passwordDoc.hashedPassword
    );

    console.log('✅ Password Match:', isValid);

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    console.log('🎉 LOGIN SUCCESS');

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      {
        expiresIn: '7d',
      }
    );

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        name: user.name,
      },
    });

    response.cookies.set('auth_access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('🔥 LOGIN ERROR:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
