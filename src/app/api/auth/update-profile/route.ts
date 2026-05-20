/**
 * @file src/app/api/auth/update-profile/route.ts
 * Update profile for the currently authenticated user — MongoDB-backed.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { connectDB, User } from '@/lib/models';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const sessionUser = await getSessionUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const { name, phone, location } = await request.json();

    if (!name && !phone && !location) {
      return NextResponse.json({ error: 'At least one field (name, phone, location) is required.' }, { status: 400 });
    }

    await connectDB();

    const updates: Record<string, string> = {};
    if (name)     updates.name = name.trim();
    if (phone)    updates.phone = phone.trim();
    if (location) updates.location = location.trim();

    const updated = await User.findByIdAndUpdate(
      sessionUser.id,
      updates,
      { new: true }
    ).select('-refreshToken').lean();

    if (!updated) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    logger.info(`✅ Profile updated for: ${sessionUser.email}`);
    return NextResponse.json({
      success: true,
      user: {
        id:       String(updated._id),
        email:    updated.email,
        role:     updated.role,
        name:     updated.name,
        phone:    updated.phone,
        location: updated.location,
      },
    });

  } catch (error) {
    logger.error('update-profile error', error);
    return NextResponse.json({ error: 'Failed to update profile.' }, { status: 500 });
  }
}
