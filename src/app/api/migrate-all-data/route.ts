import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 Starting complete data migration to MongoDB...');
    
    const { MongoClient } = require('mongodb');
    const uri = process.env.TURSO_CONNECTION_MONGODB_URI || 'mongodb+srv://sukkamanikantagoud_db_user:ZZBbpijo3jun3Oc0@astrustedconsultany.5wcilrm.mongodb.net/?appName=ASTRUSTEDCONSULTANY';
    
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('as-trusted-consultancy');
    
    const dataDir = path.join(process.cwd(), 'data');
    const results = {
      users: { migrated: 0, errors: [] },
      plots: { migrated: 0, errors: [] },
      inquiries: { migrated: 0, errors: [] },
      registrations: { migrated: 0, errors: [] },
      contacts: { migrated: 0, errors: [] },
      passwords: { migrated: 0, errors: [] }
    };
    
    // Migrate Users
    try {
      const usersData = await fs.readFile(path.join(dataDir, 'users.json'), 'utf8');
      const users = JSON.parse(usersData);
      
      if (users.length > 0) {
        await db.collection('users').deleteMany({});
        await db.collection('users').insertMany(users);
        results.users.migrated = users.length;
        console.log(`✅ Migrated ${users.length} users`);
      }
    } catch (error) {
      results.users.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Migrate Plots
    try {
      const plotsData = await fs.readFile(path.join(dataDir, 'plots.json'), 'utf8');
      const plots = JSON.parse(plotsData);
      
      if (plots.length > 0) {
        await db.collection('plots').deleteMany({});
        await db.collection('plots').insertMany(plots);
        results.plots.migrated = plots.length;
        console.log(`✅ Migrated ${plots.length} plots`);
      }
    } catch (error) {
      results.plots.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Migrate Inquiries
    try {
      const inquiriesData = await fs.readFile(path.join(dataDir, 'inquiries.json'), 'utf8');
      const inquiries = JSON.parse(inquiriesData);
      
      if (inquiries.length > 0) {
        await db.collection('inquiries').deleteMany({});
        await db.collection('inquiries').insertMany(inquiries);
        results.inquiries.migrated = inquiries.length;
        console.log(`✅ Migrated ${inquiries.length} inquiries`);
      }
    } catch (error) {
      results.inquiries.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Migrate Registrations
    try {
      const registrationsData = await fs.readFile(path.join(dataDir, 'registrations.json'), 'utf8');
      const registrations = JSON.parse(registrationsData);
      
      if (registrations.length > 0) {
        await db.collection('registrations').deleteMany({});
        await db.collection('registrations').insertMany(registrations);
        results.registrations.migrated = registrations.length;
        console.log(`✅ Migrated ${registrations.length} registrations`);
      }
    } catch (error) {
      results.registrations.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Migrate Contacts
    try {
      const contactsData = await fs.readFile(path.join(dataDir, 'contacts.json'), 'utf8');
      const contacts = JSON.parse(contactsData);
      
      if (contacts.length > 0) {
        await db.collection('contacts').deleteMany({});
        await db.collection('contacts').insertMany(contacts);
        results.contacts.migrated = contacts.length;
        console.log(`✅ Migrated ${contacts.length} contacts`);
      }
    } catch (error) {
      results.contacts.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Migrate Passwords
    try {
      const passwordsData = await fs.readFile(path.join(dataDir, 'passwords.json'), 'utf8');
      const passwords = JSON.parse(passwordsData);
      
      if (passwords.length > 0) {
        await db.collection('passwords').deleteMany({});
        await db.collection('passwords').insertMany(passwords);
        results.passwords.migrated = passwords.length;
        console.log(`✅ Migrated ${passwords.length} passwords`);
      }
    } catch (error) {
      results.passwords.errors.push(error instanceof Error ? error.message : 'Unknown error');
    }
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('plots').createIndex({ plotNumber: 1 }, { unique: true });
    await db.collection('passwords').createIndex({ email: 1 }, { unique: true });
    
    // Verify data in MongoDB
    const verification = {
      users: await db.collection('users').countDocuments(),
      plots: await db.collection('plots').countDocuments(),
      inquiries: await db.collection('inquiries').countDocuments(),
      registrations: await db.collection('registrations').countDocuments(),
      contacts: await db.collection('contacts').countDocuments(),
      passwords: await db.collection('passwords').countDocuments()
    };
    
    await client.close();
    
    const totalMigrated = Object.values(results).reduce((sum, r) => sum + r.migrated, 0);
    const hasErrors = Object.values(results).some(r => r.errors.length > 0);
    
    return NextResponse.json({
      success: !hasErrors,
      message: hasErrors ? 'Migration completed with some errors' : 'Migration completed successfully!',
      results,
      verification,
      summary: {
        totalRecordsMigrated: totalMigrated,
        collectionsUpdated: 6,
        hasErrors,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
