export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';
import { redisInvalidatePattern } from '@/lib/redis';

// GET /api/property/[id]
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const property = await Property.findById(params.id).lean();
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: property });
  } catch (err) {
    logger.error(`GET /api/property/${params.id} failed`, err);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

// PATCH /api/property/[id]
export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    const property = await Property.findByIdAndUpdate(
      params.id,
      { $set: body },
      { new: true, runValidators: true }
    ).lean();

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    logger.info(`✅ Property ${params.id} updated`);

    // Invalidate cached lists
    await redisInvalidatePattern('properties:*');
    logger.info('🧹 Invalided Redis properties cache after property PATCH');

    return NextResponse.json({ success: true, data: property });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'Duplicate property number in that village' }, { status: 409 });
    }
    logger.error(`PATCH /api/property/${params.id} failed`, err);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}

// DELETE /api/property/[id]
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const property = await Property.findByIdAndDelete(params.id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    logger.info(`✅ Property ${params.id} deleted`);

    // Invalidate cached lists
    await redisInvalidatePattern('properties:*');
    logger.info('🧹 Invalided Redis properties cache after property DELETE');

    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (err) {
    logger.error(`DELETE /api/property/${params.id} failed`, err);
    return NextResponse.json({ error: 'Failed to delete property' }, { status: 500 });
  }
}