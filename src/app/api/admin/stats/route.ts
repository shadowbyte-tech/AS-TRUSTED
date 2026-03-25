export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getUsers, getPlots, getInquiries, getRegistrations, getContacts } from '@/lib/supabase-actions';

export async function GET() {
  try {
    const [users, plots, inquiries, registrations, contacts] = await Promise.all([
      getUsers(),
      getPlots(),
      getInquiries(),
      getRegistrations(),
      getContacts()
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalPlots: plots.length,
        totalInquiries: inquiries.length,
        totalRegistrations: registrations.length,
        totalContacts: contacts.length,
        database: 'supabase'
      }
    });

  } catch (error) {
    console.error('❌ Error fetching stats:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
