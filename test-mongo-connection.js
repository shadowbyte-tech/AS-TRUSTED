const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

const uri = process.env.MONGODB_URI || process.env.TURSO_CONNECTION_MONGODB_URI;

async function testConnection() {
  if (!uri) {
    console.error('❌ MONGODB_URI or TURSO_CONNECTION_MONGODB_URI not found in .env.local');
    return false;
  }

  console.log('Attempting to connect to:', uri.split('@')[1]); // Log part of URI for security

  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    const adminDb = client.db('admin');
    const result = await adminDb.command({ ping: 1 });
    console.log('✅ Ping result:', result);
    
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  } finally {
    await client.close();
  }
}

testConnection();
