'use server';

import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from './models';

export interface State {
  message: string | null;
  errors: Record<string, string[] | undefined>;
  success: boolean;
}

export async function createUserAction(prevState: State, formData: FormData): Promise<State> {
  const email = (formData.get('email') as string)?.trim().toLowerCase();
  const password = formData.get('password') as string;
  const name = (formData.get('name') as string)?.trim() || email.split('@')[0];
  const role = (formData.get('role') as string) || 'User';

  // Input validation
  if (!email || !password) {
    return {
      message: 'Email and password are required',
      errors: {
        email: !email ? ['Email is required'] : undefined,
        password: !password ? ['Password is required'] : undefined,
      },
      success: false,
    };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      message: 'Invalid email format',
      errors: { email: ['Please enter a valid email address'] },
      success: false,
    };
  }

  if (password.length < 8) {
    return {
      message: 'Password must be at least 8 characters',
      errors: { password: ['Password must be at least 8 characters long'] },
      success: false,
    };
  }

  try {
    await connectDB();

    // Check for existing user
    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return {
        message: 'A user with this email already exists',
        errors: { email: ['Email is already registered'] },
        success: false,
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create User document
    const newUser = await User.create({
      email,
      name,
      role,
      isBlocked: false,
    });

    // Store hashed password in Password collection
    await Password.create({
      userId: newUser._id,
      email,
      hashedPassword,
    });

    return {
      message: `User ${email} created successfully`,
      errors: {},
      success: true,
    };
  } catch (error: any) {
    console.error('❌ createUserAction error:', error);
    if (error.code === 11000) {
      return {
        message: 'A user with this email already exists',
        errors: { email: ['Email is already registered'] },
        success: false,
      };
    }
    return {
      message: 'An error occurred while creating the user. Please try again.',
      errors: {},
      success: false,
    };
  }
}
