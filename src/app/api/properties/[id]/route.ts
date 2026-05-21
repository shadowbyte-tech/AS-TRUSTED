/**
 * @file src/app/api/properties/[id]/route.ts
 * Single property CRUD — MongoDB-backed.
 */
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

// ─── GET /api/properties/[id] ─────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findById(id).lean();

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    logger.error('GET /api/properties/[id] failed', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch property' }, { status: 500 });
  }
}

// ─── PUT /api/properties/[id] ─────────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    const property = await Property.findByIdAndUpdate(
      id,
      { ...body },
      { new: true, runValidators: true }
    ).lean();

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    logger.info(`✅ Property updated: ${id}`);
    return NextResponse.json({ success: true, data: property });
  } catch (error) {
    logger.error('PUT /api/properties/[id] failed', error);
    return NextResponse.json({ success: false, error: 'Failed to update property' }, { status: 500 });
  }
}

// ─── DELETE /api/properties/[id] ──────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const { id } = await params;
    const property = await Property.findByIdAndDelete(id).lean();

    if (!property) {
      return NextResponse.json({ success: false, error: 'Property not found' }, { status: 404 });
    }

    logger.info(`✅ Property deleted: ${id}`);
    return NextResponse.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    logger.error('DELETE /api/properties/[id] failed', error);
    return NextResponse.json({ success: false, error: 'Failed to delete property' }, { status: 500 });
  }
}
