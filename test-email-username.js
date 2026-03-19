const { MongoClient, ServerApiVersion } = require('mongodb');

// Test with email as username
const uri = "mongodb+srv://sukkamanikantagoud%40gmail.com:buddy%4004@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function testEmailUsername() {
  try {
    console.log('🔄 Testing with email username: sukkamanikantagoud@gmail.com');
    console.log('URI:', uri.replace(/:[^:@]*@/, ':****@'));
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("✅ SUCCESS! Connected to MongoDB with email username!");
    
    // Test database operations
    const db = client.db("astc_database");
    const collections = await db.listCollections().toArray();
    console.log('📁 Collections:', collections.map(c => c.name));
    
    // Test write
    const result = await db.collection('test').insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Email username works!' 
    });
    console.log('✅ Write successful! ID:', result.insertedId);
    
    // Clean up
    await db.collection('test').deleteOne({ test: true });
    console.log('✅ Delete successful!');
    
    console.log('\n🎉 MONGODB IS NOW WORKING WITH EMAIL USERNAME!');
    
  } catch (error) {
    console.error('❌ Still failed:', error.message);
    
    console.log('\n🔧 Next steps:');
    console.log('1. Go to MongoDB Atlas Dashboard');
    console.log('2. Database Access → Check if user exists');
    console.log('3. If no user, create: sukkamanikantagoud@gmail.com');
    console.log('4. Network Access → Add 0.0.0.0/0');
    
  } finally {
    await client.close();
  }
}

testEmailUsername();