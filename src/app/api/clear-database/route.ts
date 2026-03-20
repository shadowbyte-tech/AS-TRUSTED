import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🧹 Clearing MongoDB Atlas database...');
    
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Clear all collections (including sample data)
    const collections = ['users', 'plots', 'passwords', 'inquiries', 'registrations', 'contacts', 'comments', 'embedded_movies', 'movies', 'sessions', 'theaters', 'test'];
    
    const results = {};
    
    for (const collectionName of collections) {
      try {
        const result = await db.collection(collectionName).deleteMany({});
        results[collectionName] = {
          deleted: result.deletedCount,
          success: true
        };
        console.log(`✅ Cleared collection: ${collectionName} (${result.deletedCount} documents)`);
      } catch (error) {
        results[collectionName] = {
          deleted: 0,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
        console.log(`❌ Failed to clear ${collectionName}:`, error);
      }
    }
    
    // Create indexes for your collections
    try {
      await db.collection('users').createIndex({ email: 1 }, { unique: true });
      await db.collection('plots').createIndex({ plotNumber: 1 }, { unique: true });
      await db.collection('passwords').createIndex({ email: 1 }, { unique: true });
      console.log('✅ Created indexes for users, plots, passwords');
    } catch (error) {
      console.log('⚠️ Index creation warning:', error);
    }
    
    await client.close();
    
    const totalDeleted = Object.values(results).reduce((sum, result) => sum + (result.deleted || 0), 0);
    const successCount = Object.values(results).filter(result => result.success).length;
    
    return NextResponse.json({
      success: successCount === collections.length,
      message: `Cleared ${successCount}/${collections.length} collections successfully`,
      results,
      summary: {
        totalCollections: collections.length,
        successCount,
        totalDocumentsDeleted: totalDeleted,
        database: 'as-trusted-consultancy',
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Database clearing failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
