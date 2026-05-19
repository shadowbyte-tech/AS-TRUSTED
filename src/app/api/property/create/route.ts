export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    if (!body.propertyNumber || !body.propertyType || !body.villageName || !body.areaName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const property = await Property.create(body);
    logger.info(`✅ Property created: ${property._id}`);

    return NextResponse.json({ success: true, data: property.toObject(), message: 'Property created successfully' }, { status: 201 });
  } catch (err: any) {
    logger.error('POST /api/property/create failed', err);
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Duplicate property number in that village' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}