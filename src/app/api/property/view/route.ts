export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { incrementPropertyViews, getProperty } from '@/lib/mongodb-database';
import { getClientIP } from '@/lib/security';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();
    
    if (!propertyId) {
      return NextResponse.json({ error: 'Property ID is required' }, { status: 400 });
    }

    // Get client IP for session tracking
    const clientIP = getClientIP(request);
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const timestamp = new Date().toISOString();

    // Check if property exists
    const property = await getProperty(propertyId);

    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Increment views in MongoDB
    await incrementPropertyViews(propertyId);
    
    // Log analytical data for reference
    logger.info(`👁️ Property View Tracked: ${propertyId} from ${clientIP}`);

    return NextResponse.json({ 
      success: true, 
      message: 'View tracked successfully',
      data: {
        propertyId,
        timestamp,
        clientIP
      }
    });

  } catch (error) {
    logger.error('Error tracking property view:', error);
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 });
  }
}
