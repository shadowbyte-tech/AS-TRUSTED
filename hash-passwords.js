const bcrypt = require('bcryptjs');

const passwords = {
  "swamy@consult.com": "swamy@2775",
  "premium@astrustedconsultancy.com": "premium@123", 
  "owner@astrustedconsultancy.com": "owner@123",
  "mani@consult.com": "mani@123",
  "premium2@astrustedconsultancy.com": "premium2@123",
  "asss25122023@gmail.com": "user@123",
  "sukka@consult.com": "sukka@123"
};

async function hashPasswords() {
  const saltRounds = 12;
  const hashedPasswords = {};
  
  for (const [email, password] of Object.entries(passwords)) {
    const hash = await bcrypt.hash(password, saltRounds);
    hashedPasswords[email] = hash;
    console.log(`Hashed ${email}: ${hash}`);
  }
  
  return hashedPasswords;
}

hashPasswords().then(hashed => {
  console.log('Hashed passwords:', JSON.stringify(hashed, null, 2));
}).catch(console.error);
