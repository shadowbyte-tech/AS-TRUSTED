import { NextRequest, NextResponse } from 'next/server';

// Mock AI access database (in production, this would be in a real database)
const aiAccessUsers = new Map<string, { hasAIAccess: boolean; plan: string; activatedAt: string }>();

export async function POST(request: NextRequest) {
  try {
    const { userEmail } = await request.json();
    
    if (!userEmail) {
      return NextResponse.json({ error: 'User email is required' }, { status: 400 });
    }

    // Check if user has AI access
    const userAccess = aiAccessUsers.get(userEmail);
    const hasAIAccess = userAccess?.hasAIAccess || false;

    return NextResponse.json({
      hasAIAccess,
      plan: userAccess?.plan || null,
      activatedAt: userAccess?.activatedAt || null
    });

  } catch (error) {
    console.error('Error checking AI access:', error);
    return NextResponse.json({ error: 'Failed to check AI access' }, { status: 500 });
  }
}
