import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    // Test MongoDB connection first
    const { MongoClient } = require('mongodb');
    const uri = 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@smkg.wc88qhm.mongodb.net/?appName=SMKG';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    console.log('🚀 Starting migration to MongoDB...');
    
    // Read all existing data files
    const dataDir = path.join(process.cwd(), 'data');
    
    // Migrate users
    console.log('📦 Migrating users...');
    const usersData = await fs.readFile(path.join(dataDir, 'users.json'), 'utf8');
    const users = JSON.parse(usersData);
    await db.collection('users').deleteMany({});
    if (users.length > 0) {
      await db.collection('users').insertMany(users);
      console.log(`✅ Migrated ${users.length} users`);
    }
    
    // Migrate plots
    console.log('📦 Migrating plots...');
    const plotsData = await fs.readFile(path.join(dataDir, 'plots.json'), 'utf8');
    const plots = JSON.parse(plotsData);
    await db.collection('plots').deleteMany({});
    if (plots.length > 0) {
      // Handle duplicate plot numbers by adding suffix
      const plotNumbers = new Set();
      const processedPlots = plots.map((plot, index) => {
        let plotNumber = plot.plotNumber;
        let suffix = '';
        let counter = 1;
        
        while (plotNumbers.has(plotNumber + suffix)) {
          suffix = `-${counter}`;
          counter++;
        }
        
        const finalPlotNumber = plotNumber + suffix;
        plotNumbers.add(finalPlotNumber);
        
        return {
          ...plot,
          plotNumber: finalPlotNumber,
          _id: plot.id || `plot-${index}`
        };
      });
      
      await db.collection('plots').insertMany(processedPlots);
      console.log(`✅ Migrated ${processedPlots.length} plots (duplicates handled)`);
    }
    
    // Migrate other collections
    const collections = ['inquiries', 'registrations', 'contacts'];
    for (const collectionName of collections) {
      try {
        const filePath = path.join(dataDir, `${collectionName}.json`);
        const data = await fs.readFile(filePath, 'utf8');
        const items = JSON.parse(data);
        
        await db.collection(collectionName).deleteMany({});
        if (items.length > 0) {
          await db.collection(collectionName).insertMany(items);
          console.log(`✅ Migrated ${items.length} ${collectionName}`);
        }
      } catch (error) {
        console.log(`⚠️ No data found for ${collectionName}`);
      }
    }
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('plots').createIndex({ plotNumber: 1 }, { unique: true });
    
    await client.close();
    
    // Verify data
    const userCount = await db.collection('users').countDocuments();
    const plotCount = await db.collection('plots').countDocuments();
    
    return NextResponse.json({
      success: true,
      message: 'Migration completed successfully!',
      stats: {
        users: userCount,
        plots: plotCount,
        totalCollections: collections.length + 2
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Migration failed - check MongoDB connection'
    }, { status: 500 });
  }
}
