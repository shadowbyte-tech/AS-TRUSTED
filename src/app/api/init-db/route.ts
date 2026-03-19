import { NextResponse } from 'next/server';
import { createPropertyTables } from '@/lib/property-database';

export async function GET() {
  try {
    await createPropertyTables();
    return NextResponse.json({ success: true, message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Database initialization error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
