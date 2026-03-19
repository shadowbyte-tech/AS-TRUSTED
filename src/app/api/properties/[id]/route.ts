export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { updateProperty, getProperty } from '@/lib/property-database';
import { PropertySchema } from '@/lib/property-validation';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const property = await getProperty(id);
    if (!property) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }
    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json({ error: 'Failed to fetch property' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate input
    const validatedData = PropertySchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Update property
    const updatedProperty = await updateProperty(id, validatedData.data);
    
    return NextResponse.json({ 
      success: true, 
      property: updatedProperty 
    });
    
  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json({ error: 'Failed to update property' }, { status: 500 });
  }
}
