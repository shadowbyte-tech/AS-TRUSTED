export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readUsers } from '@/lib/mongodb-database';
import { readPlots } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

export async function GET(request: NextRequest) {
  try {
    logger.info('🔍 ADMIN API - Fetching admin stats...');
    
    // Fetch plots data
    const plots = await readPlots();
    logger.info('🔍 ADMIN API - Plots fetched:', plots.length);

    // Fetch users data
    const users = await readUsers();
    logger.info('🔍 ADMIN API - Users fetched:', users.length);

    // Fallback data for inquiries and registrations
    const inquiries = [
      { id: 'inq-1', name: 'John Doe', email: 'john@example.com', message: 'Interested in property', createdAt: new Date().toISOString() },
      { id: 'inq-2', name: 'Jane Smith', email: 'jane@example.com', message: 'Looking for plots', createdAt: new Date().toISOString() }
    ];

    const registrations = [
      { id: 'reg-1', name: 'Alice Johnson', email: 'alice@example.com', phone: '+1234567890', createdAt: new Date().toISOString() },
      { id: 'reg-2', name: 'Bob Wilson', email: 'bob@example.com', phone: '+0987654321', createdAt: new Date().toISOString() }
    ];

    const stats = {
      totalPlots: plots.length,
      totalUsers: users.length - 1, // Exclude owner from count
      totalInquiries: inquiries.length,
      totalRegistrations: registrations.length,
      recentActivity: [
        { type: 'plot', description: `${plots.length} plots available`, timestamp: new Date().toISOString() },
        { type: 'inquiry', description: `${inquiries.length} inquiries received`, timestamp: new Date().toISOString() },
        { type: 'registration', description: `${registrations.length} user registrations`, timestamp: new Date().toISOString() }
      ]
    };

    logger.info('🔍 ADMIN API - Final stats:', stats);

    return NextResponse.json(stats);
  } catch (error) {
    logger.error('❌ ADMIN API - Error fetching stats:', error);
    
    // Return fallback stats
    const fallbackStats = {
      totalPlots: 0,
      totalUsers: 2, // At least premium and regular users
      totalInquiries: 0,
      totalRegistrations: 0,
      recentActivity: []
    };

    return NextResponse.json(fallbackStats, { status: 500 });
  }
}
