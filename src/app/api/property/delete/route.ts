export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { deleteProperty } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    logger.info('🗑️ PROPERTY DELETE API - Attempting to delete property:', id);

    // Delete the property
    const deleted = await deleteProperty(id);

    if (deleted) {
      logger.info('✅ PROPERTY DELETE API - Property deleted successfully:', id);
      return NextResponse.json({
        success: true,
        message: 'Property deleted successfully'
      });
    } else {
      logger.warn('❌ PROPERTY DELETE API - Property not found:', id);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    logger.error('❌ PROPERTY DELETE API - Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to delete property',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
