/**
 * @file src/app/api/plots/route.ts
 * Plots = Properties of type "Plot". Uses MongoDB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit    = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const status   = searchParams.get('status');
    const category = searchParams.get('category');
    const village  = searchParams.get('village');

    const filter: Record<string, any> = { propertyType: 'Plot' };
    if (status)   filter.status = status;
    if (category) filter.category = category;
    if (village)  filter.villageName = { $regex: village, $options: 'i' };

    const skip  = (page - 1) * limit;
    const total = await Property.countDocuments(filter);
    const plots = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({ success: true, data: plots, total, page, pages: Math.ceil(total / limit) });
  } catch (err) {
    logger.error('GET /api/plots failed', err);
    return NextResponse.json({ error: 'Failed to fetch plots' }, { status: 500 });
  }
}
