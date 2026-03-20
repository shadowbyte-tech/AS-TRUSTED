import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    console.log('🔍 Simple owner login attempt:', email);
    
    // Hardcoded fallback credentials
    const hardcodedUsers = [
      { email: 'owner@astrustedconsultancy.com', password: 'manikanta@2775', role: 'Owner', name: 'Owner User', id: 'owner-001' },
      { email: 'swamy@consult.com', password: 'manikanta@2775', role: 'Owner', name: 'Swamy Goud', id: 'swamy-001' },
      { email: 'admin@astrustedconsultancy.com', password: 'admin123', role: 'Owner', name: 'Admin User', id: 'admin-001' }
    ];
    
    // Check hardcoded credentials first
    const hardcodedUser = hardcodedUsers.find(u => u.email === email && u.password === password);
    
    if (hardcodedUser) {
      console.log('✅ Found hardcoded user:', hardcodedUser.email);
      
      // Create simple JWT token
      const token = Buffer.from(`${hardcodedUser.id}:${hardcodedUser.email}:${Date.now()}`).toString('base64');
      
      const response = NextResponse.json({
        success: true,
        message: 'Login successful',
        user: {
          id: hardcodedUser.id,
          email: hardcodedUser.email,
          role: hardcodedUser.role,
          name: hardcodedUser.name
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
    }
    
    // If not found in hardcoded, try MongoDB (but this might fail)
    try {
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
      
    } catch (mongoError) {
      console.error('❌ MongoDB error, falling back to hardcoded check failed:', mongoError);
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials'
      }, { status: 401 });
    }
    
  } catch (error) {
    console.error('❌ Simple login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
