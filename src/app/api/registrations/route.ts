/**
 * @file src/app/api/registrations/route.ts
 * Lead/Registration submissions — MongoDB.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Lead } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const leads = await Lead.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: leads });
  } catch (err) {
    logger.error('GET /api/registrations failed', err);
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, email, notes } = body;

    if (!name || !phone || !email) {
      return NextResponse.json({ error: 'Name, phone, and email are required' }, { status: 400 });
    }

    const lead = await Lead.create({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      notes: notes?.trim(),
      isUnread: true,
    });

    logger.info(`✅ Lead registered: ${email}`);
    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (err: any) {
    logger.error('POST /api/registrations failed', err);
    return NextResponse.json({ error: 'Failed to submit registration' }, { status: 500 });
  }
}
