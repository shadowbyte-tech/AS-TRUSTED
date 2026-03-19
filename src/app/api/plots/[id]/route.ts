export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { readPlots, updatePlot, deletePlot } from '@/lib/mongodb-database';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const plots = await readPlots();
    const plot = plots.find(p => p.id === id);
    if (!plot) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 });
    }
    return NextResponse.json(plot);
  } catch (error) {
    console.error('Error fetching plot:', error);
    return NextResponse.json({ error: 'Failed to fetch plot' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updated = await updatePlot(id, body);
    if (!updated) {
      return NextResponse.json({ error: 'Plot not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Plot updated successfully' });
  } catch (error) {
    console.error('Error updating plot:', error);
    return NextResponse.json({ error: 'Failed to update plot' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deletePlot(id);
    return NextResponse.json({ success: true, message: 'Plot deleted successfully' });
  } catch (error) {
    console.error('Error deleting plot:', error);
    return NextResponse.json({ error: 'Failed to delete plot' }, { status: 500 });
  }
}
