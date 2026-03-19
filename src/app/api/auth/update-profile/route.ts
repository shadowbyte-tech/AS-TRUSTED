export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { updateOwnerProfile } from '@/lib/database';
import { verifyToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'Owner') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { name, phone, location } = await request.json();

    // Update owner profile in database
    const updatedUser = await updateOwnerProfile(decoded.email, {
      name,
      phone,
      location
    });

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: 'Profile updated successfully' 
    });

  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}
