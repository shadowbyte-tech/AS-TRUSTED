const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/as-trusted-consultancy?appName=ASTRUSTEDCONSULTANY';

async function checkUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected!');

    const db = mongoose.connection.db;
    
    console.log('Using Database:', db.databaseName);
    console.log('Collections:', (await db.listCollections().toArray()).map(c => c.name));

    const users = await db.collection('users').find({}).toArray();
    console.log('Users found:', users.length);
    users.forEach(u => console.log(`- ${u.email} (${u.role})`));

    const passwords = await db.collection('passwords').find({}).toArray();
    console.log('Passwords found:', passwords.length);
    passwords.forEach(p => console.log(`- ${p.email} (Start: ${p.hashedPassword?.substring(0, 5)}...)`));

    const plots = await db.collection('plots').find({}).toArray();
    console.log('Plots found:', plots.length);
    plots.forEach(p => console.log(`- ${p.plotNumber} in ${p.villageName} (${p.status})`));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUsers();
