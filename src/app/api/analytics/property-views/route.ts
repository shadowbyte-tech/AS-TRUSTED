export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { connectDB, Property } from '@/lib/models';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    await connectDB();
    
    // Sum all views across properties
    const result = await Property.aggregate([
      { $group: { _id: null, totalViews: { $sum: '$views' } } }
    ]);

    const totalViews = result.length > 0 ? result[0].totalViews : 0;

    return NextResponse.json({
      success: true,
      views: totalViews
    });

  } catch (error: any) {
    logger.error('GET /api/analytics/property-views failed:', error);
    return NextResponse.json({
      error: 'Failed to fetch property views analytics',
      details: error.message
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: 'propertyId is required' }, { status: 400 });
    }

    await connectDB();

    const updatedProperty = await Property.findByIdAndUpdate(
      propertyId,
      { 
        $inc: { views: 1 },
        $set: { lastViewedAt: new Date() }
      },
      { new: true }
    );

    if (!updatedProperty) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      views: updatedProperty.views
    });

  } catch (error: any) {
    logger.error('POST /api/analytics/property-views failed:', error);
    return NextResponse.json({
      error: 'Failed to track property view',
      details: error.message
    }, { status: 500 });
  }
}
