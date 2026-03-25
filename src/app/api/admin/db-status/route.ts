export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { getUsers, getPlots } from '@/lib/supabase-actions';

export async function GET() {
  try {
    const users = await getUsers();
    const plots = await getPlots();

    return NextResponse.json({
      connected: true,
      type: 'Supabase',
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
      connected: false,
      type: 'Error',
      database: 'supabase',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
