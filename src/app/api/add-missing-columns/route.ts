export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';

export async function GET() {
  try {
    console.log('🔧 Updating MongoDB collections with missing fields...');
    const client = await clientPromise;
    const db = client.db('test'); // The database where collections exist
    
    // Add missing fields to plots collection
    const result = await db.collection('plots').updateMany(
      { views: { $exists: false } },
      { $set: { views: 0 } }
    );
    
    const result2 = await db.collection('plots').updateMany(
      { last_viewed_at: { $exists: false } },
      { $set: { last_viewed_at: null } }
    );
    
    console.log('✅ MongoDB fields updated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Missing MongoDB fields added successfully',
      modifiedPlots: result.modifiedCount + result2.modifiedCount
    });
    
  } catch (error) {
    console.error('💥 Failed to add missing MongoDB fields:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}