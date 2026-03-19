require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = "mongodb+srv://Vercel-Admin-as-trusted-consultancy:DEyNeV57jM73uap3@as-trusted-consultancy.ehwtipr.mongodb.net/?retryWrites=true&w=majority";
  console.log('Testing URI:', uri ? uri.replace(/:([^:@]+)@/, ':****@') : 'UNDEFINED');
  
  if (!uri) {
    console.error('❌ MONGODB_URI is not set in .env.local');
    return;
  }
  
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully!');
    const db = client.db();
    const users = await db.collection('users').find({}).toArray();
    console.log('Users in DB:', users.length);
    const passwords = await db.collection('passwords').find({}).toArray();
    console.log('Passwords in DB:', passwords.length);
  } catch (err) {
    console.error('❌ Connection failed:', err.message);
  } finally {
    await client.close();
  }
}

testConnection();
