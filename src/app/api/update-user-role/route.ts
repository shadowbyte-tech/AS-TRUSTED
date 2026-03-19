export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers } from '@/lib/mongodb-database';

export async function POST(request: NextRequest) {
  try {
    const { email, role } = await request.json();

    if (!email || !role) {
      return NextResponse.json({ error: 'Email and role are required' }, { status: 400 });
    }

    const users = await readUsers();
    const userIndex = users.findIndex(u => u.email === email);

    if (userIndex === -1) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user role
    users[userIndex].role = role;
    await writeUsers(users);

    return NextResponse.json({ 
      success: true, 
      message: `User role updated to ${role}`,
      user: users[userIndex]
    });

  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json({ error: 'Failed to update user role' }, { status: 500 });
  }
}
