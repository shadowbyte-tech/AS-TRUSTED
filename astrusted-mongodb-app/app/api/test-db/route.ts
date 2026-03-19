import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '../../../lib/mongodb';

export async function GET() {
  try {
    const db = await getDatabase();
    await db.db().admin().command({ ping: 1 });
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
