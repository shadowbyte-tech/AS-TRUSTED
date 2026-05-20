export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/models';

/**
 * GET /api/init-db
 * Patches all existing User documents that are missing isActive/isBlocked fields.
 * Safe to run multiple times (idempotent).
 */
export async function GET() {
  try {
    await connectDB();

    // Backfill missing isActive and isBlocked fields on ALL existing users
    const result = await User.updateMany(
      {
        $or: [
          { isActive:  { $exists: false } },
          { isBlocked: { $exists: false } },
        ],
      },
      {
        $set: {
          isActive:  true,
          isBlocked: false,
        },
      }
    );

    return NextResponse.json({
      success: true,
      message: `Patched ${result.modifiedCount} user(s) with missing isActive/isBlocked fields.`,
      matched:  result.matchedCount,
      modified: result.modifiedCount,
    });
  } catch (error) {
    console.error('init-db error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
