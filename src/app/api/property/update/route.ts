import { NextRequest, NextResponse } from 'next/server';
import { updateProperty } from '@/lib/property-database';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const propertyData = await request.json();
    
    logger.info('📝 PROPERTY UPDATE API - Received data for:', propertyData.id);

    // Validate required fields
    if (!propertyData.id) {
      return NextResponse.json(
        { error: 'Property ID is required' },
        { status: 400 }
      );
    }

    // Update the property
    const updatedProperty = await updateProperty(propertyData.id, propertyData);
    
    if (updatedProperty) {
      logger.info('✅ PROPERTY UPDATE API - Property updated successfully:', updatedProperty.id);
      return NextResponse.json({
        success: true,
        property: updatedProperty,
        message: 'Property updated successfully'
      });
    } else {
      logger.warn('❌ PROPERTY UPDATE API - Property not found:', propertyData.id);
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    logger.error('❌ PROPERTY UPDATE API - Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to update property',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
