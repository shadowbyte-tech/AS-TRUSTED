export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Don't allow deletion of Owner users
    if (users[userIndex].role === 'Owner') {
      return NextResponse.json({ error: 'Cannot delete Owner users' }, { status: 403 });
    }

    // Remove user from array
    const updatedUsers = users.filter(u => u.email !== email);
    await writeUsers(updatedUsers);

    logger.info(`✅ User deleted: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: 'User deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting user:', error);
    return NextResponse.json({ 
      error: 'Failed to delete user' 
    }, { status: 500 });
  }
}
