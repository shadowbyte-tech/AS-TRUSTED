const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');

async function updatePassword() {
  const password = 'password';
  const email = 'swamy@consult.com';
  
  // Create new hash
  const newHash = await bcrypt.hash(password, 10);
  console.log('New hash for "password":', newHash);
  
  // Test the hash
  const testResult = await bcrypt.compare(password, newHash);
  console.log('Hash test result:', testResult);
  
  if (!testResult) {
    console.error('Hash test failed!');
    return;
  }
  
  // Connect to MongoDB
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://sukkamanikantagoud%40gmail.com:buddy%4004@smkg.wc88qhm.mongodb.net/astc_database?retryWrites=true&w=majority&appName=SMKG';
  console.log('Connecting to MongoDB Atlas...');
  
  try {
    const client = new MongoClient(mongoUri);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const passwordsCollection = db.collection('passwords');
    
    // Update the password
    const result = await passwordsCollection.updateOne(
      { email: email },
      { $set: { hashedPassword: newHash } },
      { upsert: true }
    );
    
    console.log('Update result:', result);
    
    // Verify the update
    const updatedDoc = await passwordsCollection.findOne({ email: email });
    console.log('Updated document:', updatedDoc);
    
    await client.close();
    console.log('✅ Password updated successfully in MongoDB');
    
  } catch (error) {
    console.error('❌ MongoDB error:', error);
  }
}

updatePassword().catch(console.error);