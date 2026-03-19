export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { db } from '@/lib/property-database';
import { logger } from '@/lib/logger';


export async function GET() {
  try {
    logger.info('🔧 Adding missing columns to properties table...');
    
    // Add views column if it doesn't exist
    await db.execute(`
      ALTER TABLE properties ADD COLUMN views INTEGER DEFAULT 0
    `);
    
    // Add last_viewed_at column if it doesn't exist
    await db.execute(`
      ALTER TABLE properties ADD COLUMN last_viewed_at TEXT
    `);
    
    // Update existing properties to have default views
    await db.execute(`
      UPDATE properties SET views = 0 WHERE views IS NULL
    `);
    
    logger.info('✅ Missing columns added successfully');
    
    // Test the updated table
    const result = await db.execute('SELECT COUNT(*) as count FROM properties');
    const sample = await db.execute('SELECT id, property_number, views FROM properties LIMIT 3');
    
    return NextResponse.json({
      success: true,
      message: 'Missing columns added successfully',
      totalProperties: result.rows[0].count,
      sampleProperties: sample.rows
    });
    
  } catch (error) {
    console.error('💥 Failed to add missing columns:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}