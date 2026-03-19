const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://Vercel-Admin-as-trusted-consultancy:DEyNeV57jM73uap3@as-trusted-consultancy.ehwtipr.mongodb.net/?retryWrites=true&w=majority';

async function testConnection() {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('🔍 URI:', uri);
    
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connected to MongoDB successfully!');
    
    // Test database operations
    const db = client.db('as-trusted-consultancy');
    await db.command({ ping: 1 });
    console.log('✅ Database ping successful!');
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📋 Existing collections:', collections.map(c => c.name));
    
    await client.close();
    console.log('✅ Connection closed');
    
  } catch (error) {
    console.error('❌ Connection failed:', error);
    process.exit(1);
  }
}

testConnection();
