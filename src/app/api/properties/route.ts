/**
 * @file src/app/api/properties/route.ts
 * Properties CRUD — MongoDB Atlas via Mongoose.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

// ─── GET /api/properties ─────────────────────────────────────────────────────
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page     = Math.max(1, parseInt(searchParams.get('page') || '1'));
    const limit    = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')));
    const type     = searchParams.get('type');
    const status   = searchParams.get('status');
    const category = searchParams.get('category');
    const village  = searchParams.get('village');

    const filter: Record<string, any> = {};
    if (type)     filter.propertyType = type;
    if (status)   filter.status = status;
    if (category) filter.category = category;
    if (village)  filter.villageName = { $regex: village, $options: 'i' };

    const skip  = (page - 1) * limit;
    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      data:  properties,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    logger.error('GET /api/properties failed', err);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

// ─── POST /api/properties ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    if (!body.propertyNumber || !body.propertyType || !body.villageName || !body.areaName) {
      return NextResponse.json({ error: 'Missing required fields: propertyNumber, propertyType, villageName, areaName' }, { status: 400 });
    }

    const property = await Property.create(body);
    logger.info(`✅ Property created: ${property._id}`);

    return NextResponse.json({ success: true, data: property }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A property with this number already exists in that village' }, { status: 409 });
    }
    logger.error('POST /api/properties failed', err);
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
