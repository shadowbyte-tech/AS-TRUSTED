/**
 * @file src/app/api/plots/[id]/route.ts
 * Single plot lookup — MongoDB-backed, uses Property model.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const plot = await Property.findById(params.id).lean();

    if (!plot) {
      return NextResponse.json({ success: false, error: 'Plot not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: plot });
  } catch (error) {
    logger.error('GET /api/plots/[id] failed', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch plot' }, { status: 500 });
  }
}