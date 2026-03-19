import { NextRequest, NextResponse } from 'next/server';
import { readPlots, createPlot } from '@/lib/mongodb-database';
import { PlotSchema } from '@/lib/validation';
import { requireOwner } from '@/lib/api-auth';
import { createAuditTrail } from '@/lib/audit';
import { logger } from '@/lib/logger';

export const revalidate = 3600; // Cache for 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100); // cap at 100
    const skip = (page - 1) * limit;

    const allPlots = await readPlots();
    const paginatedPlots = allPlots.slice(skip, skip + limit);

    return NextResponse.json({
      data: paginatedPlots,
      meta: {
        total: allPlots.length,
        page,
        limit,
        totalPages: Math.ceil(allPlots.length / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching plots:', error);
    return NextResponse.json({ error: 'Failed to fetch plots' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  // 🔒 OWNER ONLY — only authenticated owners can create plots
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    const body = await request.json();

    const validatedData = PlotSchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newPlot = await createPlot({
      ...validatedData.data,
      propertyType: 'Plot',
      propertyNumber: validatedData.data.plotNumber,
      imageUrl: validatedData.data.imageUrl || '',
      price: validatedData.data.price || 0,
      imageHint: 'custom upload',
    });

    // 🕒 AUDIT: Log successful plot creation
    await createAuditTrail({
      action: 'CREATE_PLOT',
      category: 'ADMIN',
      resourceId: newPlot.id,
      details: { plotNumber: validatedData.data.plotNumber },
      request,
    });

    return NextResponse.json({ success: true, plotId: newPlot.id }, { status: 201 });
  } catch (error) {
    logger.error('Error creating plot:', error);
    
    // 🕒 AUDIT: Log failed attempt
    await createAuditTrail({
      action: 'CREATE_PLOT',
      category: 'ADMIN',
      status: 'FAILURE',
      details: { error: error instanceof Error ? error.message : String(error) },
      request,
    });

    return NextResponse.json({ error: 'Failed to create plot' }, { status: 500 });
  }
}
