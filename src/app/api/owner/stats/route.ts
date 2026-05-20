import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User, Property, Inquiry, Lead, Contact, SiteVisit } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();

    const [users, properties, inquiries, leads, contacts, siteVisits, unreadLeads] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Inquiry.countDocuments(),
      Lead.countDocuments(),
      Contact.countDocuments(),
      SiteVisit.countDocuments(),
      Lead.countDocuments({ isUnread: true }),
    ]);

    return NextResponse.json({
      success: true,
      database: 'MongoDB Atlas',
      stats: {
        users,
        properties,
        inquiries,
        leads,
        contacts,
        siteVisits,
        unreadLeads,
      },
    });
  } catch (err) {
    logger.error('admin/stats failed', err);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
