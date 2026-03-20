import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    return NextResponse.json({
      success: true,
      message: 'POST API is working',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to parse JSON',
      timestamp: new Date().toISOString()
    });
  }
}
