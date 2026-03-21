export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { createProperty } from '@/lib/mongodb-database';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const propertyData = await request.json();
    
    logger.info('🏠 PROPERTY CREATION API - Received data for:', propertyData.propertyNumber);

    // Validate required fields
    const requiredFields = ['propertyNumber', 'propertyType', 'villageName', 'areaName', 'price'];
    for (const field of requiredFields) {
      if (!propertyData[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create the property
    const newProperty = await createProperty(propertyData);
    
    logger.info('✅ PROPERTY CREATION API - Property created successfully:', newProperty.id);

    return NextResponse.json({
      success: true,
      property: newProperty,
      message: 'Property created successfully'
    });

  } catch (error) {
    logger.error('❌ PROPERTY CREATION API - Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to create property',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
