/**
 * @file src/app/api/contacts/route.ts
 * Contacts CRUD — MongoDB-backed, owner-only writes.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Contact } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: contacts, count: contacts.length });
  } catch (error) {
    logger.error('GET /api/contacts failed', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch contacts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const body = await request.json();

    if (!body.name || !body.phone || !body.email || !body.type) {
      return NextResponse.json({ error: 'name, phone, email, and type are required.' }, { status: 400 });
    }

    const contact = await Contact.create({ ...body, email: body.email.toLowerCase() });
    logger.info(`✅ Contact created: ${contact.email}`);
    return NextResponse.json({ success: true, data: contact }, { status: 201 });
  } catch (err: any) {
    if (err.code === 11000) {
      return NextResponse.json({ error: 'A contact with this email already exists.' }, { status: 409 });
    }
    logger.error('POST /api/contacts failed', err);
    return NextResponse.json({ error: 'Failed to create contact' }, { status: 500 });
  }
}
