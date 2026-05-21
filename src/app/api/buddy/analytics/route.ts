export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, SystemSettings } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  // Only owners can view analytics
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    
    const interactions = await SystemSettings.findOne({ key: 'BUDDY_INTERACTIONS' }).lean();
    
    return NextResponse.json({
      success: true,
      totalInteractions: interactions ? interactions.value : 0
    });

  } catch (error: any) {
    logger.error('GET /api/buddy/analytics failed:', error);
    return NextResponse.json({
      error: 'Failed to fetch Buddy analytics',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();
    if (!action || action !== 'record_interaction') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    await connectDB();

    // Increment interaction count in system settings
    const updatedSettings = await SystemSettings.findOneAndUpdate(
      { key: 'BUDDY_INTERACTIONS' },
      { 
        $inc: { value: 1 },
        $setOnInsert: { description: 'Total number of Buddy AI interactions' }
      },
      { new: true, upsert: true }
    );

    return NextResponse.json({
      success: true,
      totalInteractions: updatedSettings.value
    });

  } catch (error: any) {
    logger.error('POST /api/buddy/analytics failed:', error);
    return NextResponse.json({
      error: 'Failed to record Buddy analytics',
      details: error.message
    }, { status: 500 });
  }
}
