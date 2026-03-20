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
      
      const { MongoClient } = require('mongodb');
      const uri = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
      
      const client = new MongoClient(uri);
      await client.connect();
      const db = client.db('as-trusted-consultancy');
      
      const user = await db.collection('users').findOne(
        { id: decoded.id },
        { projection: { id: 1, email: 1, role: 1, name: 1, phone: 1, location: 1 } }
      );
      
      await client.close();
      
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
