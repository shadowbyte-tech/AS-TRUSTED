export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getUsers, getPlots } from '@/lib/supabase-actions';

export async function GET() {
  try {
    const users = await getUsers();
    const plots = await getPlots();

    return NextResponse.json({
      status: 'connected',
      database: 'supabase',
      stats: {
        users: users.length,
        plots: plots.length,
        tables: ['users', 'plots', 'inquiries', 'registrations', 'contacts']
      }
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return NextResponse.json({
      status: 'error',
      database: 'supabase',
      error: error.message
    }, { status: 500 });
  }
}
