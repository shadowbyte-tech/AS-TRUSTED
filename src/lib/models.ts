import mongoose from 'mongoose';
import { validateAndLogEnv } from './env-validation';

// Hardcoded directly to the Atlas cluster with the correct database name
const WORKING_MONGODB_URI = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/as-trusted-consultancy?appName=ASTRUSTEDCONSULTANY';
let MONGODB_URI = process.env.MONGODB_URI || '';

// Force bypass of any broken/stale environment variables (especially on Vercel)
if (!MONGODB_URI || MONGODB_URI.includes('smkg.wc88qhm.mongodb.net')) {
  MONGODB_URI = WORKING_MONGODB_URI;
}

// ─── AUDIT LOGS ───────────────────────────────────────────────────
const AuditLogSchema = new mongoose.Schema({
  action: { type: String, required: true, index: true }, // e.g., 'CREATE_PLOT', 'UPDATE_USER_ROLE'
  category: { type: String, required: true, enum: ['AUTH', 'ADMIN', 'DATABASE', 'SECURITY'] },
  userId: { type: String, index: true }, // User who performed the action
  userEmail: String,
  ip: String,
  userAgent: String,
  resourceId: String, // ID of the affected object (plot ID, user ID)
  details: { type: mongoose.Schema.Types.Mixed }, // Arbitrary diagnostic data
  status: { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
  createdAt: { type: Date, default: Date.now, index: true },
});

export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);

// ─── INITIALIZATION ──────────────────────────────────────────────
// Validate environment at startup
validateAndLogEnv();

// Global mongoose connection
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000, // Fail fast in 5 seconds
      connectTimeoutMS: 10000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      return m;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// Plot Schema
const PlotSchema = new mongoose.Schema({
  plotNumber: { type: String, required: true },
  villageName: { type: String, required: true },
  areaName: { type: String, required: true },
  plotSize: { type: String, required: true },
  plotFacing: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'],
    required: true
  },
  imageUrl: { type: String, required: true },
  imageHint: { type: String, default: 'custom upload' },
  description: { type: String },
  price: { type: Number },
  pricePerSqft: { type: Number },
  priceNegotiable: { type: Boolean, default: false },
  status: {
    type: String,
    enum: ['Available', 'Reserved', 'Sold', 'Under Negotiation'],
    default: 'Available'
  },
  category: {
    type: String,
    enum: ['Normal', 'Premium'],
    default: 'Normal'
  },
  isDtcpApproved: { type: Boolean, default: false },
  isReadyToConstruct: { type: Boolean, default: false },
  hasHighwayAccess: { type: Boolean, default: false },
  images: [{ type: String }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for performance
PlotSchema.index({ villageName: 1, areaName: 1 });
PlotSchema.index({ price: 1 });
PlotSchema.index({ category: 1 });
PlotSchema.index({ status: 1 });
PlotSchema.index({ plotNumber: 1, villageName: 1 }, { unique: true });

// User Schema
const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['Owner', 'User', 'Premium', 'Elite'], required: true },
  name: { type: String, trim: true },
  phone: { type: String, trim: true },
  location: { type: String, trim: true },
  refreshToken: { type: String }, // For refresh token rotation
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
});

UserSchema.index({ role: 1 });

// Registration Schema
const RegistrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  notes: { type: String },
  isUnread: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

RegistrationSchema.index({ email: 1 });
RegistrationSchema.index({ createdAt: -1 });

// Inquiry Schema
const InquirySchema = new mongoose.Schema({
  plotNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now }
});

InquirySchema.index({ receivedAt: -1 });

// Contact Schema
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['Seller', 'Buyer', 'Investor', 'Agent', 'Other'], required: true },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now }
});

ContactSchema.index({ email: 1 });

// Password Schema (stores bcrypt-hashed passwords only)
const PasswordSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hashedPassword: { type: String, required: true }, // Always bcrypt hash — NEVER plain text
  isMigrated: { type: Boolean, default: true },    // true = already bcrypt, false = legacy (plain text)
  updatedAt: { type: Date, default: Date.now }
});

// Export models
export const Plot = mongoose.models.Plot || mongoose.model('Plot', PlotSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const Password = mongoose.models.Password || mongoose.model('Password', PasswordSchema);

// Add to global type
declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
