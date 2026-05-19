/**
 * @file src/app/api/site-visits/route.ts
 * Site visit bookings — MongoDB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, SiteVisit } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const visits = await SiteVisit.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: visits });
  } catch (err) {
    logger.error('GET /api/site-visits failed', err);
    return NextResponse.json({ error: 'Failed to fetch site visits' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, email, preferredDate, preferredTime, location, message } = body;

    if (!name || !phone || !email || !preferredDate || !preferredTime || !location) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const visit = await SiteVisit.create({
      name: name.trim(), phone: phone.trim(),
      email: email.trim().toLowerCase(),
      preferredDate, preferredTime,
      location: location.trim(),
      message: message?.trim(),
      status: 'Pending',
    });

    logger.info(`✅ Site visit booked: ${email}`);
    return NextResponse.json({ success: true, data: visit }, { status: 201 });
  } catch (err) {
    logger.error('POST /api/site-visits failed', err);
    return NextResponse.json({ error: 'Failed to book site visit' }, { status: 500 });
  }
}