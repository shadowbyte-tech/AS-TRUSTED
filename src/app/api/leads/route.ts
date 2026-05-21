/**
 * @file src/app/api/leads/route.ts
 * Captures general leads (e.g., from the Onboarding Wizard).
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Lead } from '@/lib/models';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const { name, phone, goal, budget, location, source } = body;

    if (!name || !phone) {
      return NextResponse.json({ error: 'Name and Phone are required' }, { status: 400 });
    }

    const lead = await Lead.create({ 
      name, 
      phone, 
      goal, 
      budget, 
      location, 
      source: source || 'Onboarding' 
    });
    
    logger.info(`✅ New lead captured: ${name} (${phone})`);

    return NextResponse.json({ success: true, data: lead }, { status: 201 });
  } catch (err) {
    logger.error('POST /api/leads failed', err);
    return NextResponse.json({ error: 'Failed to save lead' }, { status: 500 });
  }
}
