import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Checking MongoDB users and passwords...');
    
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Get all users
    const users = await db.collection('users').find({}).toArray();
    
    // Get all passwords
    const passwords = await db.collection('passwords').find({}).toArray();
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      users: users.map(u => ({
        id: u.id,
        email: u.email,
        role: u.role,
        name: u.name
      })),
      passwords: passwords.map(p => ({
        email: p.email,
        hasHashedPassword: !!p.hashedPassword,
        hasPassword: !!p.password,
        passwordLength: p.hashedPassword ? p.hashedPassword.length : (p.password ? p.password.length : 0)
      })),
      summary: {
        userCount: users.length,
        passwordCount: passwords.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Check failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
