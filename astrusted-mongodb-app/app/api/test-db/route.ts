import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Simple success response for now
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection test - Simple version working',
      timestamp: new Date().toISOString(),
      note: 'MongoDB integration will be added after basic auth works'
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
