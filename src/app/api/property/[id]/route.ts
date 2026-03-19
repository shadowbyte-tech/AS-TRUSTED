import { NextRequest, NextResponse } from 'next/server';
import { getProperty } from '@/lib/property-database';
import { logger } from '@/lib/logger';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    logger.info('?? PROPERTY GET API - Fetching property:', id);

    const property = await getProperty(id);

    if (property) {
      logger.info('? PROPERTY GET API - Property found:', property.id);
      return NextResponse.json({
        success: true,
        property
      });
    } else {
      logger.warn('? PROPERTY GET API - Property not found:', id);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('❌ PROPERTY GET API - Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch property',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
