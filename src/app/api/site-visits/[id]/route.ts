/**
 * @file src/app/api/site-visits/[id]/route.ts
 * Update a site visit booking status — MongoDB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, SiteVisit } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

const VALID_STATUSES = ['Pending', 'Confirmed', 'Completed', 'Cancelled'] as const;

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const { id } = params;
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` },
        { status: 400 }
      );
    }

    await connectDB();

    const visit = await SiteVisit.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).lean();

    if (!visit) {
      return NextResponse.json({ error: 'Site visit not found' }, { status: 404 });
    }

    logger.info(`✅ Site visit ${id} status updated to ${status}`);
    return NextResponse.json({ success: true, data: visit });
  } catch (err) {
    logger.error('PATCH /api/site-visits/[id] failed', err);
    return NextResponse.json({ error: 'Failed to update site visit' }, { status: 500 });
  }
}
