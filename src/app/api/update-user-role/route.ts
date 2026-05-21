export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  // 1. Authenticate: Only an Owner can change user roles
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const { email, newRole } = await request.json();

    if (!email || !newRole) {
      return NextResponse.json({ error: 'Email and newRole are required' }, { status: 400 });
    }

    const validRoles = ['User', 'Premium', 'Owner'];
    if (!validRoles.includes(newRole)) {
      return NextResponse.json({ error: `Invalid role. Must be one of: ${validRoles.join(', ')}` }, { status: 400 });
    }

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { role: newRole } },
      { new: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    logger.info(`User role updated: ${email} is now ${newRole}`);

    return NextResponse.json({
      success: true,
      message: `Successfully updated ${email} to ${newRole}`,
      user: {
        email: updatedUser.email,
        role: updatedUser.role
      }
    });

  } catch (error: any) {
    logger.error('POST /api/update-user-role failed:', error);
    return NextResponse.json({
      error: 'Failed to update user role',
      details: error.message
    }, { status: 500 });
  }
}