export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const authCookie = request.cookies.get('auth')?.value;
    
    if (!authCookie) {
      return NextResponse.json({ user: null });
    }

    // Simple user lookup based on hardcoded data
    const users = [
      { id: '1', email: 'admin@astrustedconsultancy.com', role: 'Owner' },
      { id: '2', email: 'mani@consult.com', role: 'User' },
      { id: '3', email: 'premium@astrustedconsultancy.com', role: 'Premium' }
    ];

    // For simplicity, return the first user (in real app, you'd decode JWT or session)
    return NextResponse.json({ 
      user: users[0] // Return admin user for now
    });
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null });
  }
}
