import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Clearing only plots collection...');
    
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Clear only plots collection
    const result = await db.collection('plots').deleteMany({});
    
    await client.close();
    
    return NextResponse.json({
      success: true,
      message: `Cleared ${result.deletedCount} plots from database`,
      deletedCount: result.deletedCount,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Failed to clear plots:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
