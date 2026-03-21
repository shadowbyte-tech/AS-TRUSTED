import mongoose from 'mongoose';
import { validateAndLogEnv } from './env-validation';

// Hardcoded directly to the Atlas cluster with the correct database name
// We are explicitly ignoring process.env.MONGODB_URI to prevent Vercel from injecting broken/stale values.
const MONGODB_URI = 'mongodb+srv://sukkamanikantagoud_db_user:fsCicMHlSu2vk3iM@astrustedconsultany.5wcilrm.mongodb.net/as-trusted-consultancy?appName=ASTRUSTEDCONSULTANY';

// ─── AUDIT LOGS ───────────────────────────────────────────────────
const AuditLogSchema = new mongoose.Schema({
  _id: { type: String, required: true },
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
      serverSelectionTimeoutMS: 2000, // Very aggressive for serverless
      connectTimeoutMS: 5000,
    };

    logger.info('🔌 Connecting to MongoDB Atlas...');
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((m) => {
      logger.info('🔌 MongoDB Connected Successfully');
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

// Property Schema (Unified for Plot, House, and Land)
const PropertySchema = new mongoose.Schema({
  _id: { type: String, required: true },
  propertyNumber: { type: String, required: true },
  propertyType: { 
    type: String, 
    enum: ['Plot', 'House', 'Land'], 
    required: true,
    index: true 
  },
  villageName: { type: String, required: true },
  areaName: { type: String, required: true },
  imageUrl: { type: String },
  imageHint: { type: String, default: 'custom upload' },
  description: { type: String },
  price: { type: Number },
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
  images: [{ type: String }],
  
  // Plot Specific
  plotNumber: { type: String },
  plotSize: { type: String },
  plotFacing: {
    type: String,
    enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']
  },
  pricePerSqft: { type: Number },
  isDtcpApproved: { type: Boolean, default: false },
  isReadyToConstruct: { type: Boolean, default: false },
  hasHighwayAccess: { type: Boolean, default: false },
  
  // House Specific
  houseSize: { type: String },
  bedrooms: { type: Number },
  bathrooms: { type: Number },
  floors: { type: Number },
  houseType: { 
    type: String, 
    enum: ['Independent', 'Villa', 'Apartment', 'Duplex', 'Penthouse'] 
  },
  furnished: { type: Boolean, default: false },
  parking: { type: Boolean, default: false },
  amenities: [{ type: String }],
  yearBuilt: { type: Number },
  
  // Land Specific
  landSize: { type: String },
  landType: { 
    type: String, 
    enum: ['Agricultural', 'Commercial', 'Residential', 'Industrial'] 
  },
  zoning: { type: String },
  roadAccess: { type: Boolean, default: false },
  waterConnection: { type: Boolean, default: false },
  electricityConnection: { type: Boolean, default: false },
  soilType: { type: String },
  topography: { type: String },

  // Analytics
  views: { type: Number, default: 0 },
  lastViewedAt: { type: Date },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Add indexes for performance
PropertySchema.index({ villageName: 1, areaName: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ category: 1 });
PropertySchema.index({ status: 1 });
PropertySchema.index({ propertyNumber: 1, villageName: 1 }, { unique: true });

// User Schema
const UserSchema = new mongoose.Schema({
  _id: { type: String, required: true },
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
  _id: { type: String, required: true },
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
  _id: { type: String, required: true },
  plotNumber: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  receivedAt: { type: Date, default: Date.now }
});

InquirySchema.index({ receivedAt: -1 });

// Contact Schema
const ContactSchema = new mongoose.Schema({
  _id: { type: String, required: true },
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
  _id: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  hashedPassword: { type: String, required: true }, // Always bcrypt hash — NEVER plain text
  isMigrated: { type: Boolean, default: true },    // true = already bcrypt, false = legacy (plain text)
  timestamp: { type: Date, default: Date.now }
});

const FavoriteSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  plotId: { type: String, required: true }, // Keeping plotId for compatibility
  addedAt: { type: Date, default: Date.now },
  notes: { type: String }
});

const ComparisonSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  userId: { type: String, required: true },
  plotIds: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date }
});

// Export models
export const Property = mongoose.models.Property || mongoose.model('Property', PropertySchema);
export const Plot = mongoose.models.Plot || mongoose.model('Plot', PropertySchema); // Changed PlotSchema to PropertySchema
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const Registration = mongoose.models.Registration || mongoose.model('Registration', RegistrationSchema);
export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', InquirySchema);
export const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);
export const Password = mongoose.models.Password || mongoose.model('Password', PasswordSchema);
export const AuditTrail = mongoose.models.AuditTrail || mongoose.model('AuditTrail', AuditLogSchema); // Changed AuditTrailSchema to AuditLogSchema
export const Favorite = mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
export const Comparison = mongoose.models.Comparison || mongoose.model('Comparison', ComparisonSchema);

// Add to global type
declare global {
  var mongoose: {
    conn: any;
    promise: any;
  };
}
