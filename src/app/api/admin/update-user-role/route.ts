export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/mongodb-database';
import { verifyToken } from '@/lib/auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'Owner') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    // Validate role
    const validRoles = ['User', 'Premium', 'Owner'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: 'Invalid role. Must be User, Premium, or Owner' }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user role
    users[userIndex].role = role;
    await writeUsers(users);

    logger.info(`✅ Updated user role: ${email} -> ${role}`);

    return NextResponse.json({ 
      success: true, 
      message: `User role updated to ${role}`,
      user: users[userIndex]
    });

  } catch (error) {
    logger.error('Error updating user role:', error);
    return NextResponse.json({ 
      error: 'Failed to update user role' 
    }, { status: 500 });
  }
}
