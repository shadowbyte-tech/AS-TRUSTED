const { MongoClient, ServerApiVersion } = require('mongodb');

// Using the exact format from MongoDB Atlas
const uri = "mongodb+srv://sukkamanikantagoud_db_user:buddy%4004@smkg.wc88qhm.mongodb.net/?appName=SMKG";

// Create a MongoClient with MongoDB Atlas recommended options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    console.log('URI:', uri.replace(/:[^:@]*@/, ':****@'));
    
    // Connect the client to the server
    await client.connect();
    
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("✅ Pinged your deployment. You successfully connected to MongoDB!");
    
    // Test database operations
    const db = client.db("astc_database");
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test write operation
    const testCollection = db.collection('connection_test');
    const result = await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Atlas connection successful!' 
    });
    console.log('✅ Write operation successful! ID:', result.insertedId);
    
    // Test read operation
    const document = await testCollection.findOne({ test: true });
    console.log('✅ Read operation successful:', document.message);
    
    // Clean up
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful!');
    
    console.log('\n🎉 ALL MONGODB OPERATIONS SUCCESSFUL!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔧 Authentication failed. Please verify:');
      console.log('1. Username: sukkamanikantagoud_db_user');
      console.log('2. Password: buddy@04');
      console.log('3. MongoDB Atlas Database Access settings');
    }
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 Connection refused. Please check:');
      console.log('1. MongoDB Atlas Network Access settings');
      console.log('2. Your IP address is whitelisted');
      console.log('3. Cluster is running and accessible');
    }
    
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);