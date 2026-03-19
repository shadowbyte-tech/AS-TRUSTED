import { NextRequest, NextResponse } from 'next/server';
import { createRegistration, readRegistrations } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

// Site visits are stored as registrations with notes for visit details
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newVisit = await createRegistration({
      name: body.name,
      phone: body.phone,
      email: body.email,
      notes: `Site visit request — Date: ${body.preferredDate}, Time: ${body.preferredTime}, Location: ${body.location}${body.message ? `, Message: ${body.message}` : ''}`,
      createdAt: new Date().toISOString(),
      isNew: true,
    });
    return NextResponse.json({ success: true, visitId: newVisit.id }, { status: 201 });
  } catch (error) {
    logger.error('Error creating site visit:', error);
    return NextResponse.json({ error: 'Failed to create site visit' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const visits = await readRegistrations();
    return NextResponse.json(visits);
  } catch (error) {
    logger.error('Error fetching site visits:', error);
    return NextResponse.json({ error: 'Failed to fetch site visits' }, { status: 500 });
  }
}
