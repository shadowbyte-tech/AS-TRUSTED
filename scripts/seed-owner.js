/**
 * scripts/seed-owner.js
 * Creates or resets the Owner account in MongoDB Atlas.
 *
 * Usage:
 *   node scripts/seed-owner.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

// MongoDB Atlas URI from environment
const SRV_URI = process.env.MONGODB_URI;

// Optional direct shard fallback
const DIRECT_URI =
  'mongodb://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@ac-4jfzd59-shard-00-00.5wcilrm.mongodb.net:27017,ac-4jfzd59-shard-00-01.5wcilrm.mongodb.net:27017,ac-4jfzd59-shard-00-02.5wcilrm.mongodb.net:27017/as-trusted-consultancy?ssl=true&replicaSet=atlas-13o8qn-shard-0&authSource=admin&retryWrites=true&w=majority';

// Owner credentials
const OWNER_EMAIL =
  process.env.OWNER_EMAIL || 'owner@astrustedconsultancy.com';

const OWNER_PASSWORD =
  process.env.OWNER_PASSWORD || 'Manikanta@5923';

// User Schema
const UserSchema = new mongoose.Schema(
  {
    email: String,
    role: String,
    name: String,
    isActive: Boolean,
    isBlocked: Boolean,
  },
  { timestamps: true }
);

// Password Schema
const PasswordSchema = new mongoose.Schema(
  {
    email: String,
    hashedPassword: String,
  },
  { timestamps: true }
);

// Models
const User =
  mongoose.models.User || mongoose.model('User', UserSchema);

const Password =
  mongoose.models.Password ||
  mongoose.model('Password', PasswordSchema);

// Connect to MongoDB
async function connect() {
  try {
    console.log('🔌 Trying SRV connection...');

    await mongoose.connect(SRV_URI, {
      serverSelectionTimeoutMS: 8000,
    });

    console.log('✅ Connected via SRV');
  } catch (srvErr) {
    console.log(
      `⚠️  SRV failed (${srvErr.message.split('\n')[0]})`
    );

    console.log('🔌 Trying direct shard connection...');

    await mongoose.connect(DIRECT_URI, {
      serverSelectionTimeoutMS: 15000,
    });

    console.log('✅ Connected via direct shards');
  }
}

// Seed / Reset Owner
async function seed() {
  await connect();

  const existing = await User.findOne({
    email: OWNER_EMAIL.toLowerCase(),
  });

  // Hash password
  const hashedPassword = await bcrypt.hash(
    OWNER_PASSWORD,
    12
  );

  // If owner already exists → reset password
  if (existing) {
    console.log('ℹ️  Owner exists — resetting password...');

    await Password.findOneAndUpdate(
      { email: OWNER_EMAIL.toLowerCase() },
      { hashedPassword },
      { upsert: true }
    );

    console.log('\n✅ Owner password reset successfully!');
    console.log(`   Email:    ${OWNER_EMAIL}`);
    console.log(`   Password: ${OWNER_PASSWORD}\n`);

    await mongoose.disconnect();
    return;
  }

  // Create owner account
  await User.create({
    email: OWNER_EMAIL.toLowerCase(),
    role: 'Owner',
    name: 'AS Trusted Admin',
    isActive: true,
    isBlocked: false,
  });

  await Password.create({
    email: OWNER_EMAIL.toLowerCase(),
    hashedPassword,
  });

  console.log('\n✅ Owner account created!');
  console.log(`   Email:    ${OWNER_EMAIL}`);
  console.log(`   Password: ${OWNER_PASSWORD}`);
  console.log(
    '\n⚠️  Change this password after first login!\n'
  );

  await mongoose.disconnect();
}

// Run script
seed().catch((e) => {
  console.error('❌ Seed failed:', e.message || e);
  process.exit(1);
});