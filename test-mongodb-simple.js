const { MongoClient } = require('mongodb');

async function testConnection() {
  // Test different connection string formats
  const testCases = [
    {
      name: "Current .env format",
      uri: "mongodb+srv://sukkamanikantagoud_db_user:buddy%2540%4004@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG"
    },
    {
      name: "Simple format (no database)",
      uri: "mongodb+srv://sukkamanikantagoud_db_user:buddy%2540%4004@smkg.wc88qhm.mongodb.net/?appName=SMKG"
    },
    {
      name: "Original password encoding",
      uri: "mongodb+srv://sukkamanikantagoud_db_user:buddy%4004@smkg.wc88qhm.mongodb.net/?appName=SMKG"
    }
  ];

  for (const testCase of testCases) {
    console.log(`\n🔄 Testing: ${testCase.name}`);
    console.log(`URI: ${testCase.uri.replace(/:[^:@]*@/, ':****@')}`);
    
    const client = new MongoClient(testCase.uri);
    
    try {
      await client.connect();
      console.log('✅ Connection successful!');
      
      // Test database access
      const db = client.db('astc_database');
      const collections = await db.listCollections().toArray();
      console.log('📁 Collections found:', collections.length);
      
      await client.close();
      console.log('✅ Test completed successfully');
      break; // Stop on first success
      
    } catch (error) {
      console.error('❌ Failed:', error.message);
      await client.close().catch(() => {});
    }
  }
}

console.log('🧪 MongoDB Connection Test Suite');
console.log('================================');
testConnection().catch(console.error);