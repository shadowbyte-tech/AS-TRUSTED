import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/property-database';
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
    const propertyCheck = await db.execute(`
      SELECT id FROM properties WHERE id = ?
    `, [propertyId]);

    if (propertyCheck.rows.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Insert or update view record
    await db.execute(`
      INSERT OR REPLACE INTO property_views (property_id, ip_address, user_agent, viewed_at)
      VALUES (?, ?, ?, ?)
    `, [propertyId, clientIP, userAgent]);

    // Update total view count for the property
    await db.execute(`
      UPDATE properties 
      SET views = COALESCE(views, 0) + 1,
      last_viewed_at = ?
      WHERE id = ?
    `, [timestamp, propertyId]);

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
