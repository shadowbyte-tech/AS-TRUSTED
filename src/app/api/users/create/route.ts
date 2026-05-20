/**
 * @file src/app/api/users/create/route.ts
 * Admin: create a new user — owner-only, MongoDB + bcrypt.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const body = await request.json();
    const { email, password, name, role = 'User' } = body;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required.' },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    const validRoles = ['Owner', 'User', 'Premium', 'Elite'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { success: false, message: `Role must be one of: ${validRoles.join(', ')}` },
        { status: 400 }
      );
    }

    await connectDB();

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'A user with this email already exists.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      email: email.toLowerCase(),
      name:  name?.trim() || email.split('@')[0],
      role,
      isActive:  true,
      isBlocked: false,
    });

    await Password.create({
      email: email.toLowerCase(),
      hashedPassword,
    });

    logger.info(`✅ User created by admin: ${email} (${role})`);

    return NextResponse.json({
      success: true,
      message: 'User created successfully.',
      user: {
        id:    String(newUser._id),
        email: newUser.email,
        name:  newUser.name,
        role:  newUser.role,
      },
    });

  } catch (error: any) {
    logger.error('POST /api/users/create failed', error);
    return NextResponse.json(
      { success: false, message: 'Failed to create user.' },
      { status: 500 }
    );
  }
}
