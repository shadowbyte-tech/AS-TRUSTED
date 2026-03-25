'use server';

import { createUser } from './supabase-actions';
import { getUsers } from './supabase-actions';
import type { State } from './definitions';

export async function createUserAction(prevState: State, formData: FormData): Promise<State> {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = 'User'; // Default role for new users

    // Validate input
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

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        message: 'Invalid email format',
        errors: {
          email: ['Please enter a valid email address'],
        },
        success: false,
      };
    }

    // Validate password length
    if (password.length < 8) {
      return {
        message: 'Password must be at least 8 characters long',
        errors: {
          password: ['Password must be at least 8 characters long'],
        },
        success: false,
      };
    }

    // Check if user already exists
    const existingUsers = await getUsers();
    const existingUser = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (existingUser) {
      return {
        message: 'A user with this email already exists',
        errors: {
          email: ['A user with this email already exists'],
        },
        success: false,
      };
    }

    // Create the user
    const newUser = await createUser({
      email: email.toLowerCase(),
      name: email.split('@')[0], // Use email prefix as name
      role: role,
    });

    if (!newUser) {
      return {
        message: 'Failed to create user',
        success: false,
      };
    }

    return {
      message: 'User created successfully',
      success: true,
    };

  } catch (error) {
    console.error('Error creating user:', error);
    return {
      message: 'An error occurred while creating the user',
      success: false,
    };
  }
}
