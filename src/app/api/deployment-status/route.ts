import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔍 Checking deployment status...');
    
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || process.env.MONGODB_URI || 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@smkg.wc88qhm.mongodb.net/?appName=SMKG';
    
    console.log('🔍 Using URI:', uri);
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Quick status check
    const userCount = await db.collection('users').countDocuments();
    const swamyUser = await db.collection('users').findOne({ email: 'swamygoud@consult.com' });
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: 'Deployment status check completed',
      status: {
        connected: true,
        totalUsers: userCount,
        swamyExists: !!swamyUser,
        database: 'as-trusted-consultancy',
        environment: process.env.NODE_ENV || 'unknown'
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Status check failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
