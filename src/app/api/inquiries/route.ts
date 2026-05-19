/**
 * @file src/app/api/inquiries/route.ts
 * Inquiries — MongoDB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Inquiry } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const inquiries = await Inquiry.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: inquiries });
  } catch (err) {
    logger.error('GET /api/inquiries failed', err);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { plotNumber, name, email, message } = body;

    if (!plotNumber || !name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const inquiry = await Inquiry.create({ plotNumber, name, email: email.toLowerCase(), message });
    logger.info(`✅ Inquiry created from ${email}`);

    return NextResponse.json({ success: true, data: inquiry }, { status: 201 });
  } catch (err) {
    logger.error('POST /api/inquiries failed', err);
    return NextResponse.json({ error: 'Failed to submit inquiry' }, { status: 500 });
  }
}
