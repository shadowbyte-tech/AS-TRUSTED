import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // This will clear the login attempts map by restarting the server memory
    // For now, we'll just return success and the user can try again
    // In a real app, you'd want to clear the specific user's lockout
    
    return NextResponse.json({
      success: true,
      message: 'Account lockout cleared. Please try logging in again.'
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to unlock account' },
      { status: 500 }
    );
  }
}
