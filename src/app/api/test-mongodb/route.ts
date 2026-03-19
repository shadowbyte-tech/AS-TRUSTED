import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Test MongoDB connection using your database
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || 'mongodb+srv://Vercel-Admin-as-trusted-consultancy:DEyNeV57jM73uap3@as-trusted-consultancy.ehwtipr.mongodb.net/?retryWrites=true&w=majority';
    
    console.log('🔍 Testing MongoDB connection with URI:', uri);
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    await db.command({ ping: 1 });
    
    // Test basic operations
    const collections = await db.listCollections().toArray();
    const userCount = await db.collection('users').countDocuments();
    const plotCount = await db.collection('plots').countDocuments();
    
    await client.close();
    
    return NextResponse.json({ 
      success: true, 
      message: 'MongoDB connection successful',
      timestamp: new Date().toISOString(),
      status: 'Connected to MongoDB Atlas',
      database: 'as-trusted-consultancy',
      collections: collections.map(c => c.name),
      stats: {
        users: userCount,
        plots: plotCount
      }
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return NextResponse.json({ 
      success: false, 
      message: 'MongoDB connection failed - using JSON fallback',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      status: 'Using JSON file storage'
    });
  }
}
