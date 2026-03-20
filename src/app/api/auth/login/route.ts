import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Login attempt:', email);
    
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Find user
    const user = await db.collection('users').findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!user) {
      await client.close();
      return NextResponse.json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Find password
    const passwordDoc = await db.collection('passwords').findOne({ 
      email: email.toLowerCase() 
    });
    
    if (!passwordDoc) {
      await client.close();
      return NextResponse.json({
        success: false,
        error: 'Password not found'
      });
    }
    
    const storedPassword = passwordDoc.hashedPassword || passwordDoc.password;
    
    // Check if password is bcrypt hash or plain text
    let passwordValid = false;
    if (storedPassword.startsWith('$2') || storedPassword.startsWith('$1')) {
      // Bcrypt hash - skip for now
      passwordValid = false;
      console.log('⚠️ Bcrypt password detected, skipping comparison');
    } else {
      // Plain text comparison
      passwordValid = password === storedPassword;
    }
    
    await client.close();
    
    if (!passwordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials',
        debug: {
          email: email.toLowerCase(),
          passwordType: storedPassword.startsWith('$2') ? 'bcrypt' : 'plain',
          note: 'Password comparison failed'
        }
      });
    }
    
    // Create JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
    
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/'
    });
    
    console.log('✅ Login successful for:', email);
    return response;
    
  } catch (error) {
    console.error('❌ Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}
