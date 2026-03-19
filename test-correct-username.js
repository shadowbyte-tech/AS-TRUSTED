const { MongoClient } = require('mongodb');

async function testCorrectUsername() {
  // Test with correct username (email format)
  const uri = "mongodb+srv://sukkamanikantagoud%40gmail.com:buddy%2540%4004@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG";
  
  console.log('🔄 Testing with correct username: sukkamanikantagoud@gmail.com');
  console.log('URI:', uri.replace(/:[^:@]*@/, ':****@'));
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ MongoDB connection successful!');
    
    // Test database operations
    const db = client.db('astc_database');
    const collections = await db.listCollections().toArray();
    console.log('📁 Available collections:', collections.map(c => c.name));
    
    // Test a simple write operation
    const testCollection = db.collection('connection_test');
    await testCollection.insertOne({ 
      test: true, 
      timestamp: new Date(),
      message: 'Connection test successful' 
    });
    console.log('✅ Write operation successful!');
    
    // Clean up test document
    await testCollection.deleteOne({ test: true });
    console.log('✅ Delete operation successful!');
    
    console.log('\n🎉 ALL TESTS PASSED - MongoDB is working!');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    if (error.message.includes('bad auth')) {
      console.log('\n🔧 Authentication still failing. Please check:');
      console.log('1. Username: sukkamanikantagoud@gmail.com');
      console.log('2. Password: buddy@04');
      console.log('3. MongoDB Atlas Database Access settings');
    }
  } finally {
    await client.close();
  }
}

testCorrectUsername();