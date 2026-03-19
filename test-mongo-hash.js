const bcrypt = require('bcryptjs');

async function testMongoHash() {
  const mongoHash = '$2a$12$JvsqroOCPaWZbmIzc.BTweh5Pi4VGHstk2vZ4pU9i6.tikBKm0FPW';
  const passwords = ['password', 'admin', '123456', 'swamy', 'owner', 'Password', 'PASSWORD', 'swamy123', 'consult', 'trusted', 'astrusted', 'consultancy'];
  
  console.log('Testing MongoDB hash:', mongoHash);
  
  for (const pwd of passwords) {
    const result = await bcrypt.compare(pwd, mongoHash);
    if (result) {
      console.log('✅ FOUND: Password "' + pwd + '" matches the MongoDB hash');
      return;
    } else {
      console.log('❌ "' + pwd + '" does not match');
    }
  }
  
  console.log('❌ None of the tested passwords match the MongoDB hash');
}

testMongoHash().catch(console.error);