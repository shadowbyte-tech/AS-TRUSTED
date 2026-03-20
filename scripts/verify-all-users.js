const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/as-trusted-consultancy?appName=ASTRUSTEDCONSULTANY';

async function verifyAllUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database:', mongoose.connection.db.databaseName);
    console.log('');

    const db = mongoose.connection.db;

    // 1. List all collections
    const collections = (await db.listCollections().toArray()).map(c => c.name);
    console.log('📂 Collections:', collections.join(', '));
    console.log('');

    // 2. Get all users
    const users = await db.collection('users').find({}).toArray();
    console.log(`👤 USERS (${users.length} total):`);
    console.log('─'.repeat(80));

    // 3. Get all passwords
    const passwords = await db.collection('passwords').find({}).toArray();
    const passwordMap = {};
    passwords.forEach(p => {
      passwordMap[p.email?.toLowerCase()] = p;
    });

    // 4. Cross-reference users with passwords
    for (const user of users) {
      const email = user.email?.toLowerCase();
      const pwRecord = passwordMap[email];
      
      let passwordStatus = '❌ NO PASSWORD RECORD';
      let passwordType = 'N/A';
      let canLogin = false;
      
      if (pwRecord) {
        const hash = pwRecord.hashedPassword || pwRecord.password;
        if (!hash) {
          passwordStatus = '❌ EMPTY PASSWORD';
        } else if (hash.startsWith('$2a$') || hash.startsWith('$2b$') || hash.startsWith('$2y$')) {
          passwordType = 'bcrypt hash';
          passwordStatus = '✅ Has bcrypt hash';
          canLogin = true; // Our updated login supports bcrypt
        } else {
          passwordType = 'plain text';
          passwordStatus = `✅ Has plain text password: "${hash}"`;
          canLogin = true; // Our updated login supports plain text
        }
      }
      
      console.log(`  Email: ${user.email}`);
      console.log(`  Role:  ${user.role}`);
      console.log(`  ID:    ${user._id}`);
      console.log(`  Name:  ${user.name || '(not set)'}`);
      console.log(`  Password: ${passwordStatus} (${passwordType})`);
      console.log(`  Can Login: ${canLogin ? '✅ YES' : '❌ NO'}`);
      console.log('─'.repeat(80));
    }

    // 5. Check for orphan passwords (password exists but no user)
    console.log('');
    console.log('🔍 ORPHAN CHECK (passwords without matching users):');
    const userEmails = users.map(u => u.email?.toLowerCase());
    let orphans = 0;
    for (const pw of passwords) {
      if (!userEmails.includes(pw.email?.toLowerCase())) {
        console.log(`  ⚠️ Password exists for "${pw.email}" but NO user record found!`);
        orphans++;
      }
    }
    if (orphans === 0) {
      console.log('  ✅ No orphan passwords found.');
    }

    // 6. Users without passwords
    console.log('');
    console.log('🔍 USERS WITHOUT PASSWORDS:');
    let missing = 0;
    for (const user of users) {
      if (!passwordMap[user.email?.toLowerCase()]) {
        console.log(`  ⚠️ User "${user.email}" (${user.role}) has NO password record - CANNOT login!`);
        missing++;
      }
    }
    if (missing === 0) {
      console.log('  ✅ All users have password records.');
    }

    // 7. Plots check
    console.log('');
    const plots = await db.collection('plots').find({}).toArray();
    console.log(`🏘️ PLOTS (${plots.length} total):`);
    for (const p of plots) {
      console.log(`  - ${p.plotNumber || p._id} | ${p.villageName || 'N/A'}, ${p.areaName || 'N/A'} | ${p.plotSize || 'N/A'} | ${p.status || 'N/A'} | Price: ${p.price || 'N/A'}`);
    }

    // 8. Registrations check
    const registrations = await db.collection('registrations').find({}).toArray();
    console.log('');
    console.log(`📝 REGISTRATIONS: ${registrations.length} total`);

    // 9. Summary
    console.log('');
    console.log('═'.repeat(80));
    console.log('📊 SUMMARY:');
    console.log(`  Total Users:         ${users.length}`);
    console.log(`  Users with Password: ${users.length - missing}`);
    console.log(`  Users CAN Login:     ${users.filter(u => passwordMap[u.email?.toLowerCase()]).length}`);
    console.log(`  Users CANNOT Login:  ${missing}`);
    console.log(`  Total Plots:         ${plots.length}`);
    console.log(`  Total Registrations: ${registrations.length}`);
    console.log('═'.repeat(80));

  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    await mongoose.disconnect();
  }
}

verifyAllUsers();
