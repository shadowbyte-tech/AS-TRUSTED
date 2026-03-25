export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/supabase-actions';
import { getUsers } from '@/lib/supabase-actions';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('🔍 Create user API called with:', { ...body, password: body.password ? '***' : null });

    const { email, password } = body;

    // Validate input
    if (!email || !password) {
      console.log('❌ Validation failed:', { email: !!email, password: !!password });
      return NextResponse.json({
        success: false,
        message: 'Email and password are required',
        errors: {
          email: !email ? ['Email is required'] : undefined,
          password: !password ? ['Password is required'] : undefined,
        }
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Email format validation failed:', email);
      return NextResponse.json({
        success: false,
        message: 'Invalid email format',
        errors: {
          email: ['Please enter a valid email address'],
        }
      }, { status: 400 });
    }

    // Validate password length
    if (password.length < 8) {
      console.log('❌ Password length validation failed:', { length: password.length });
      return NextResponse.json({
        success: false,
        message: 'Password must be at least 8 characters long',
        errors: {
          password: ['Password must be at least 8 characters long'],
        }
      }, { status: 400 });
    }

    // Check if user already exists
    const existingUsers = await getUsers();
    const existingUser = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'A user with this email already exists',
        errors: {
          email: ['A user with this email already exists'],
        }
      }, { status: 400 });
    }

    // Create the user
    const newUser = await createUser({
      email: email.toLowerCase(),
      name: email.split('@')[0], // Use email prefix as name
      role: 'User',
    });

    if (!newUser) {
      return NextResponse.json({
        success: false,
        message: 'Failed to create user',
        errors: {}
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'User created successfully',
      user: newUser
    });

  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({
      success: false,
      message: 'An error occurred while creating the user',
      errors: {}
    }, { status: 500 });
  }
}
