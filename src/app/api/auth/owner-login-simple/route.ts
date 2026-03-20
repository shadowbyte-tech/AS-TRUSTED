import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Simple owner login attempt:', email);
    
    // Direct MongoDB connection without any libraries
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
      }, { status: 401 });
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
      }, { status: 401 });
    }
    
    const storedPassword = passwordDoc.hashedPassword || passwordDoc.password;
    const passwordValid = password === storedPassword;
    
    await client.close();
    
    if (!passwordValid) {
      return NextResponse.json({
        success: false,
        error: 'Invalid password'
      }, { status: 401 });
    }
    
    // Create simple JWT token
    const token = Buffer.from(`${user.id}:${user.email}:${Date.now()}`).toString('base64');
    
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name
      }
    });
    
    // Set simple cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });
    
    return response;
    
  } catch (error) {
    console.error('❌ Simple login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
