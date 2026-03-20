import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Simple migration starting...');
    
    // Simple MongoDB connection test
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Just create a simple test user directly
    const testUser = {
      id: 'test-owner-001',
      email: 'admin@astrustedconsultancy.com',
      role: 'Owner',
      name: 'Test Administrator',
      createdAt: new Date().toISOString()
    };
    
    // Check if exists first
    const existing = await db.collection('users').findOne({ email: testUser.email });
    if (!existing) {
      await db.collection('users').insertOne(testUser);
      
      // Add password
      await db.collection('passwords').insertOne({
        email: testUser.email,
        hashedPassword: 'admin123', // Plain text for now
        updatedAt: new Date().toISOString()
      });
      
      console.log('✅ Test user created successfully');
    } else {
      console.log('ℹ️ Test user already exists');
    }
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'Simple migration completed!',
      user: testUser.email,
      password: 'admin123'
    });
    
  } catch (error) {
    console.error('❌ Simple migration error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
