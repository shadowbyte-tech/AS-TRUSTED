import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { email, action } = await request.json();

    if (!email || !action) {
      return NextResponse.json({ error: 'Email and action are required' }, { status: 400 });
    }

    // Validate action
    const validActions = ['block', 'unblock'];
    if (!validActions.includes(action)) {
      return NextResponse.json({ error: 'Invalid action. Must be block or unblock' }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user status
    if (action === 'block') {
      users[userIndex].blocked = true;
      users[userIndex].blockedAt = new Date().toISOString();
    } else {
      users[userIndex].blocked = false;
      users[userIndex].blockedAt = undefined;
    }

    await writeUsers(users);

    logger.info(`✅ User ${action}ed: ${email}`);

    return NextResponse.json({ 
      success: true, 
      message: `User ${action}ed successfully`,
      user: users[userIndex]
    });

  } catch (error) {
    logger.error('Error blocking/unblocking user:', error);
    return NextResponse.json({ 
      error: 'Failed to update user status' 
    }, { status: 500 });
  }
}
