import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/mongodb-database';
import { setPassword } from '@/lib/password-storage';
import bcrypt from 'bcryptjs';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json();

    if (!email || !newPassword) {
      return NextResponse.json({ error: 'Email and new password are required' }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Store the hashed password
    await setPassword(email, hashedPassword);

    logger.info(`✅ Password reset for: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Password reset successfully',
      newPassword // In production, don't return the password
    });

  } catch (error) {
    logger.error('Error resetting password:', error);
    return NextResponse.json({ 
      error: 'Failed to reset password' 
    }, { status: 500 });
  }
}
