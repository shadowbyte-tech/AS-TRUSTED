
const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('❌ MONGODB_URI is not defined in .env file');
  process.exit(1);
}

console.log('🔄 Attempting to connect to MongoDB...');
console.log(`📍 URI: ${uri.replace(/:([^@]+)@/, ':****@')}`); // Hide password for security

mongoose.connect(uri)
  .then(() => {
    console.log('✅ SUCCESS: Database connection established!');
    console.log('📦 Collections available:', Object.keys(mongoose.connection.collections));
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ FAILURE: Could not connect to MongoDB');
    console.error('-------------------------------------------');
    console.error(`Error Name: ${err.name}`);
    console.error(`Error Message: ${err.message}`);
    
    if (err.message.includes('authentication failed')) {
      console.error('\n💡 HINT: Your username or password in the MONGODB_URI is incorrect.');
      console.error('Check if the password "buddy@04" (encoded as buddy%4004) matches your MongoDB Atlas user.');
    } else if (err.message.includes('ECONNREFUSED')) {
      console.error('\n💡 HINT: The database server is unreachable. Check your network or MongoDB Atlas status.');
    }
    
    console.error('-------------------------------------------');
    process.exit(1);
  });
