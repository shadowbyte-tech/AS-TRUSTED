import { NextRequest, NextResponse } from 'next/server';
import { readProperties, createProperty } from '@/lib/property-database';
import { PropertySchema } from '@/lib/property-validation';
import { globalRateLimiter } from '@/lib/security';
import { logger } from '@/lib/logger';
import { createAuditTrail } from '@/lib/audit';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const propertyType = searchParams.get('propertyType');
    const skip = (page - 1) * limit;

    const allProperties = await readProperties();
    
    // Filter by property type if specified
    let filteredProperties = allProperties;
    if (propertyType && propertyType !== 'all') {
      filteredProperties = allProperties.filter(p => p.propertyType === propertyType);
    }
    
    // Simple in-memory pagination for now
    const paginatedProperties = filteredProperties.slice(skip, skip + limit);

    return NextResponse.json({
      data: paginatedProperties,
      meta: {
        total: filteredProperties.length,
        page,
        limit,
        totalPages: Math.ceil(filteredProperties.length / limit),
        propertyTypes: ['Plot', 'House', 'Land']
      }
    });
  } catch (error) {
    logger.error('Error fetching properties:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limit: 10 property creations per hour for admin
    if (!globalRateLimiter.isAllowed(`createProperty:${clientIP}`, 10, 60 * 60 * 1000)) {
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = PropertySchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newProperty = await createProperty({
      ...validatedData.data,
      imageUrl: validatedData.data.imageUrl || '',
      price: validatedData.data.price || 0,
      imageHint: 'custom upload',
    });
    
    // 🕒 AUDIT: Log successful property creation
    await createAuditTrail({
      action: 'CREATE_PROPERTY',
      category: 'ADMIN',
      resourceId: newProperty.id,
      details: { propertyType: validatedData.data.propertyType },
      request,
    });

    return NextResponse.json({ success: true, propertyId: newProperty.id }, { status: 201 });
  } catch (error) {
    logger.error('Error creating property:', error);
    
    // 🕒 AUDIT: Log failure
    await createAuditTrail({
      action: 'CREATE_PROPERTY',
      category: 'ADMIN',
      status: 'FAILURE',
      details: { error: error instanceof Error ? error.message : String(error) },
      request,
    });

    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 });
  }
}
