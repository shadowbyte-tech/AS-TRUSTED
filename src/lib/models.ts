/**
 * @file src/lib/models.ts
 * Single source of truth for ALL Mongoose models.
 * MongoDB Atlas is the ONLY database in this project.
 * SERVER-ONLY — never import this in client components.
 */
import 'server-only';
import mongoose from 'mongoose';

import { logger } from './logger';

// ─── CONNECTION CACHING (required for Next.js serverless) ────────────────────
declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null };
}

if (!global._mongooseCache) {
  global._mongooseCache = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      'MONGODB_URI is not set. Add it to Vercel Environment Variables or .env.local'
    );
  }

  if (global._mongooseCache.conn) {
    return global._mongooseCache.conn;
  }

  if (!global._mongooseCache.promise) {
    global._mongooseCache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 10000,
      retryWrites: true,
    }).then((m) => {
      logger.info('✅ MongoDB Atlas connected');
      return m;
    });
  }

  try {
    global._mongooseCache.conn = await global._mongooseCache.promise;
  } catch (e) {
    global._mongooseCache.promise = null;
    logger.error('❌ MongoDB connection failed', e);
    throw e;
  }

  return global._mongooseCache.conn;
}

// ─── HELPER: safe model registration (prevents OverwriteModelError) ──────────
function model<T>(name: string, schema: mongoose.Schema): mongoose.Model<T> {
  return (mongoose.models[name] || mongoose.model<T>(name, schema)) as mongoose.Model<T>;
}

// ─── PROPERTY SCHEMA ─────────────────────────────────────────────────────────
const PropertySchema = new mongoose.Schema(
  {
    propertyNumber: { type: String, required: true },
    propertyType: {
      type: String,
      enum: ['Plot', 'House', 'Land'],
      required: true,
      index: true,
    },
    villageName: { type: String, required: true, trim: true },
    areaName:    { type: String, required: true, trim: true },
    imageUrl:    { type: String, default: '' },
    imageHint:   { type: String, default: '' },
    description: { type: String, default: '' },
    price:       { type: Number, default: 0 },
    priceNegotiable: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['Available', 'Reserved', 'Sold', 'Under Negotiation', 'Under Construction'],
      default: 'Available',
      index: true,
    },
    category: {
      type: String,
      enum: ['Normal', 'Premium', 'Luxury'],
      default: 'Normal',
      index: true,
    },
    images: [{ type: String }],

    // Plot-specific
    plotNumber:  { type: String },
    plotSize:    { type: String },
    plotFacing: {
      type: String,
      enum: ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West', null],
    },
    pricePerSqft:     { type: Number },
    isDtcpApproved:   { type: Boolean, default: false },
    isReadyToConstruct: { type: Boolean, default: false },
    hasHighwayAccess: { type: Boolean, default: false },

    // House-specific
    houseSize:  { type: String },
    bedrooms:   { type: Number },
    bathrooms:  { type: Number },
    floors:     { type: Number },
    houseType:  { type: String, enum: ['Independent', 'Villa', 'Apartment', 'Duplex', 'Penthouse', null] },
    furnished:  { type: Boolean, default: false },
    parking:    { type: Boolean, default: false },
    amenities:  [{ type: String }],
    yearBuilt:  { type: Number },

    // Land-specific
    landSize:               { type: String },
    landType:               { type: String, enum: ['Agricultural', 'Commercial', 'Residential', 'Industrial', null] },
    zoning:                 { type: String },
    roadAccess:             { type: Boolean, default: false },
    waterConnection:        { type: Boolean, default: false },
    electricityConnection:  { type: Boolean, default: false },
    soilType:               { type: String },
    topography:             { type: String },

    // Analytics
    views:       { type: Number, default: 0 },
    lastViewedAt: { type: Date },
  },
  { timestamps: true }
);

PropertySchema.index({ villageName: 1, areaName: 1 });
PropertySchema.index({ price: 1 });
PropertySchema.index({ propertyNumber: 1, villageName: 1 }, { unique: true });
PropertySchema.index({ status: 1, propertyType: 1 });
PropertySchema.index({ category: 1, propertyType: 1 });

// ─── USER SCHEMA ─────────────────────────────────────────────────────────────
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['Owner', 'User', 'Premium', 'Elite'],
      required: true,
      default: 'User',
      index: true,
    },
    name:         { type: String, trim: true },
    phone:        { type: String, trim: true },
    location:     { type: String, trim: true },
    isActive:     { type: Boolean, default: true },
    isBlocked:    { type: Boolean, default: false },
    lastLoginAt:  { type: Date },
    refreshToken: { type: String, select: false },
  },
  { timestamps: true }
);

// ─── PASSWORD SCHEMA ─────────────────────────────────────────────────────────
const PasswordSchema = new mongoose.Schema(
  {
    email:          { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    hashedPassword: { type: String, required: true },
    isMigrated:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ─── LEAD SCHEMA ─────────────────────────────────────────────────────────────
const LeadSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true, trim: true },
    phone:    { type: String, required: true, trim: true },
    email:    { type: String, required: true, lowercase: true, trim: true, index: true },
    notes:    { type: String },
    isUnread: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

// ─── INQUIRY SCHEMA ──────────────────────────────────────────────────────────
const InquirySchema = new mongoose.Schema(
  {
    plotNumber: { type: String, required: true },
    name:       { type: String, required: true, trim: true },
    email:      { type: String, required: true, lowercase: true, trim: true, index: true },
    message:    { type: String, required: true },
  },
  { timestamps: true }
);

// ─── CONTACT SCHEMA ──────────────────────────────────────────────────────────
const ContactSchema = new mongoose.Schema(
  {
    name:  { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    type:  { type: String, enum: ['Seller', 'Buyer', 'Investor', 'Agent', 'Other'], required: true },
    notes: { type: String },
  },
  { timestamps: true }
);

// ─── FAVORITE SCHEMA ─────────────────────────────────────────────────────────
const FavoriteSchema = new mongoose.Schema(
  {
    userId:     { type: String, required: true, index: true },
    propertyId: { type: String, required: true },
    notes:      { type: String },
  },
  { timestamps: true }
);
FavoriteSchema.index({ userId: 1, propertyId: 1 }, { unique: true });

// ─── COMPARISON SCHEMA ───────────────────────────────────────────────────────
const ComparisonSchema = new mongoose.Schema(
  {
    userId:      { type: String, required: true, index: true },
    propertyIds: { type: [String], default: [] },
    expiresAt:   { type: Date },
  },
  { timestamps: true }
);

// ─── AUDIT LOG SCHEMA ────────────────────────────────────────────────────────
const AuditLogSchema = new mongoose.Schema(
  {
    action:    { type: String, required: true, index: true },
    category:  { type: String, required: true, enum: ['AUTH', 'ADMIN', 'DATABASE', 'SECURITY'] },
    userId:    { type: String, index: true },
    userEmail: { type: String },
    ip:        { type: String },
    userAgent: { type: String },
    resourceId: { type: String },
    details:   { type: mongoose.Schema.Types.Mixed },
    status:    { type: String, enum: ['SUCCESS', 'FAILURE'], default: 'SUCCESS' },
  },
  { timestamps: true }
);

// ─── SITE VISIT SCHEMA ───────────────────────────────────────────────────────
const SiteVisitSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true, trim: true },
    phone:         { type: String, required: true, trim: true },
    email:         { type: String, required: true, lowercase: true, trim: true },
    preferredDate: { type: String, required: true },
    preferredTime: { type: String, required: true },
    location:      { type: String, required: true },
    message:       { type: String },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'],
      default: 'Pending',
      index: true,
    },
  },
  { timestamps: true }
);

// ─── EXPORT MODELS ───────────────────────────────────────────────────────────
export const Property   = model<any>('Property',   PropertySchema);
export const User       = model<any>('User',        UserSchema);
export const Password   = model<any>('Password',    PasswordSchema);
export const Lead       = model<any>('Lead',        LeadSchema);
export const Inquiry    = model<any>('Inquiry',     InquirySchema);
export const Contact    = model<any>('Contact',     ContactSchema);
export const Favorite   = model<any>('Favorite',    FavoriteSchema);
export const Comparison = model<any>('Comparison',  ComparisonSchema);
export const AuditLog   = model<any>('AuditLog',    AuditLogSchema);
export const SiteVisit  = model<any>('SiteVisit',   SiteVisitSchema);
