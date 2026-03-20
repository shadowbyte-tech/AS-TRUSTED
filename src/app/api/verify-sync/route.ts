import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Verifying MongoDB data sync status...');
    
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    // Check MongoDB data
    const mongoData = {
      users: await db.collection('users').countDocuments(),
      plots: await db.collection('plots').countDocuments(),
      inquiries: await db.collection('inquiries').countDocuments(),
      registrations: await db.collection('registrations').countDocuments(),
      contacts: await db.collection('contacts').countDocuments(),
      passwords: await db.collection('passwords').countDocuments()
    };
    
    // Check local JSON data
    const { promises: fs } = require('fs');
    const path = require('path');
    const dataDir = path.join(process.cwd(), 'data');
    
    const localData = {
      users: 0,
      plots: 0,
      inquiries: 0,
      registrations: 0,
      contacts: 0,
      passwords: 0
    };
    
    try {
      const usersData = await fs.readFile(path.join(dataDir, 'users.json'), 'utf8');
      localData.users = JSON.parse(usersData).length;
    } catch { /* ignore */ }
    
    try {
      const plotsData = await fs.readFile(path.join(dataDir, 'plots.json'), 'utf8');
      localData.plots = JSON.parse(plotsData).length;
    } catch { /* ignore */ }
    
    try {
      const inquiriesData = await fs.readFile(path.join(dataDir, 'inquiries.json'), 'utf8');
      localData.inquiries = JSON.parse(inquiriesData).length;
    } catch { /* ignore */ }
    
    try {
      const registrationsData = await fs.readFile(path.join(dataDir, 'registrations.json'), 'utf8');
      localData.registrations = JSON.parse(registrationsData).length;
    } catch { /* ignore */ }
    
    try {
      const contactsData = await fs.readFile(path.join(dataDir, 'contacts.json'), 'utf8');
      localData.contacts = JSON.parse(contactsData).length;
    } catch { /* ignore */ }
    
    try {
      const passwordsData = await fs.readFile(path.join(dataDir, 'passwords.json'), 'utf8');
      localData.passwords = JSON.parse(passwordsData).length;
    } catch { /* ignore */ }
    
    await client.close();
    
    // Compare data
    const syncStatus = {};
    const isFullySynced = Object.keys(mongoData).every(key => mongoData[key] === localData[key]);
    
    for (const key in mongoData) {
      syncStatus[key] = {
        local: localData[key],
        mongodb: mongoData[key],
        synced: mongoData[key] === localData[key]
      };
    }
    
    return NextResponse.json({
      success: true,
      isFullySynced,
      syncStatus,
      summary: {
        totalLocalRecords: Object.values(localData).reduce((sum, count) => sum + count, 0),
        totalMongoRecords: Object.values(mongoData).reduce((sum, count) => sum + count, 0),
        readyForGitHub: isFullySynced
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('❌ Sync verification failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
