/**
 * Migration script to transfer data from JSON files to MongoDB
 * Run with: node scripts/migrate-to-mongodb.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Vercel-Admin-as-trusted-consultancy:DEyNeV57jM73uap3@as-trusted-consultancy.ehwtipr.mongodb.net/?retryWrites=true&w=majority';

if (!MONGODB_URI) {
  console.error('Error: MONGODB_URI not found in .env file');
  process.exit(1);
}

// Define schemas (same as in models.ts)
const PlotSchema = new mongoose.Schema({
  plotNumber: String,
  villageName: String,
  areaName: String,
  plotSize: String,
  plotFacing: String,
  imageUrl: String,
  imageHint: String,
  description: String,
  price: Number,
  pricePerSqft: Number,
  priceNegotiable: Boolean,
  status: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
});

const UserSchema = new mongoose.Schema({
  email: String,
  role: String,
  createdAt: { type: Date, default: Date.now },
});

const RegistrationSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  notes: String,
  isNew: Boolean,
  createdAt: Date,
});

const InquirySchema = new mongoose.Schema({
  plotNumber: String,
  name: String,
  email: String,
  message: String,
  receivedAt: Date,
});

const ContactSchema = new mongoose.Schema({
  name: String,
  phone: String,
  email: String,
  type: String,
  notes: String,
  createdAt: { type: Date, default: Date.now },
});

const PasswordSchema = new mongoose.Schema({
  email: String,
  hashedPassword: String,
  updatedAt: { type: Date, default: Date.now },
});

// Create models
const Plot = mongoose.model('Plot', PlotSchema);
const User = mongoose.model('User', UserSchema);
const Registration = mongoose.model('Registration', RegistrationSchema);
const Inquiry = mongoose.model('Inquiry', InquirySchema);
const Contact = mongoose.model('Contact', ContactSchema);
const Password = mongoose.model('Password', PasswordSchema);

// Helper to read JSON file
function readJsonFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.log(`File not found or empty: ${filePath}`);
    return null;
  }
}

async function migrate() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully!');

    const dataDir = path.join(__dirname, '..', 'data');

    // Migrate plots
    const plots = readJsonFile(path.join(dataDir, 'plots.json'));
    if (plots && plots.length > 0) {
      console.log(`Migrating ${plots.length} plots...`);
      for (const plot of plots) {
        const { id, ...plotData } = plot;
        await Plot.create(plotData);
      }
      console.log('Plots migrated successfully!');
    }

    // Migrate users
    const users = readJsonFile(path.join(dataDir, 'users.json'));
    if (users && users.length > 0) {
      console.log(`Migrating ${users.length} users...`);
      for (const user of users) {
        const { id, ...userData } = user;
        await User.create(userData);
      }
      console.log('Users migrated successfully!');
    }

    // Migrate passwords
    const passwords = readJsonFile(path.join(dataDir, 'passwords.json'));
    if (passwords) {
      console.log('Migrating passwords...');
      for (const [email, hashedPassword] of Object.entries(passwords)) {
        await Password.create({ email, hashedPassword });
      }
      console.log('Passwords migrated successfully!');
    }

    // Migrate registrations
    const registrations = readJsonFile(path.join(dataDir, 'registrations.json'));
    if (registrations && registrations.length > 0) {
      console.log(`Migrating ${registrations.length} registrations...`);
      for (const reg of registrations) {
        const { id, ...regData } = reg;
        regData.createdAt = new Date(regData.createdAt);
        await Registration.create(regData);
      }
      console.log('Registrations migrated successfully!');
    }

    // Migrate inquiries
    const inquiries = readJsonFile(path.join(dataDir, 'inquiries.json'));
    if (inquiries && inquiries.length > 0) {
      console.log(`Migrating ${inquiries.length} inquiries...`);
      for (const inq of inquiries) {
        const { id, ...inqData } = inq;
        inqData.receivedAt = new Date(inqData.receivedAt);
        await Inquiry.create(inqData);
      }
      console.log('Inquiries migrated successfully!');
    }

    // Migrate contacts
    const contacts = readJsonFile(path.join(dataDir, 'contacts.json'));
    if (contacts && contacts.length > 0) {
      console.log(`Migrating ${contacts.length} contacts...`);
      for (const contact of contacts) {
        const { id, ...contactData } = contact;
        await Contact.create(contactData);
      }
      console.log('Contacts migrated successfully!');
    }

    console.log('\n✅ Migration completed successfully!');
    console.log('You can now deploy your application to Netlify.');
    
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
}

// Run migration
migrate();
