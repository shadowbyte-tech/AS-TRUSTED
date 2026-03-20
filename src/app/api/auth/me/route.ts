export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json({ user: null });
    }
    
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      
      // Hardcoded users for immediate testing
      const validUsers = [
        { id: 'admin-001', email: 'admin@astrustedconsultancy.com', role: 'Owner', name: 'Admin User' },
        { id: 'swamy-001', email: 'swamygoud@consult.com', role: 'Owner', name: 'Swamy Goud' },
        { id: 'premium-001', email: 'premium@astrustedconsultancy.com', role: 'Premium', name: 'Premium User' }
      ];
      
      const user = validUsers.find(u => u.id === decoded.id);
      
      if (user) {
        return NextResponse.json({ user });
      } else {
        return NextResponse.json({ user: null });
      }
      
    } catch (jwtError) {
      console.error('JWT verification failed:', jwtError);
      return NextResponse.json({ user: null });
    }
    
  } catch (error) {
    console.error('Auth me error:', error);
    return NextResponse.json({ user: null });
  }
}
