/**
 * MongoDB Database Operations
 * This replaces the JSON file-based database with MongoDB
 * 
 * RESILIENCE UPDATE: If MongoDB fails (e.g., ECONNREFUSED), 
 * it automatically falls back to multi-file JSON storage in the /data directory.
 */

import { connectDB, Property, Plot, User, Registration, Inquiry, Contact, Password } from './models';
import type { Property as PropertyType, Plot as PlotType, User as UserType, Registration as RegistrationType, Inquiry as InquiryType, Contact as ContactType } from './definitions';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from './logger';
import { 
  readAllPlots, 
  createPlot as createPlotMultiFile, 
  updatePlot as updatePlotMultiFile, 
  deletePlot as deletePlotMultiFile,
  initializeMultiFileStorage,
  getStorageStats
} from './multi-file-storage';

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILES = {
  PLOTS: path.join(DATA_DIR, 'plots.json'),
  USERS: path.join(DATA_DIR, 'users.json'),
  INQUIRIES: path.join(DATA_DIR, 'inquiries.json'),
  REGISTRATIONS: path.join(DATA_DIR, 'registrations.json'),
  CONTACTS: path.join(DATA_DIR, 'contacts.json'),
  PASSWORDS: path.join(DATA_DIR, 'passwords.json'),
};

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readJsonFile<T>(filePath: string): Promise<T[]> {
  try {
    await ensureDataDir();
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeJsonFile<T>(filePath: string, data: T[]): Promise<void> {
  try {
    await ensureDataDir();
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    // Silently log and fail in production (Vercel)
    logger.warn(`Failed to write JSON file ${path.basename(filePath)}, likely read-only FS:`, err);
  }
}

// MongoDB initialization flag
let isMongoInitialized = false;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Initialize database connection
async function initDB() {
  if (isMongoInitialized) return true;
  try {
    await connectDB();
    isMongoInitialized = true;
    return true;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logger.error('MONGODB CONNECTION FAILED:', message);

    // In production, log error but ALLOW fallback to JSON instead of crashing
    if (IS_PRODUCTION) {
      logger.warn(`⚠️ PROD MODE: Database down. Falling back to multi-file JSON storage! (${message})`);
      return false;
    }

    // In development, fall back to JSON storage with a clear warning.
    logger.warn('⚠️  DEV MODE: Falling back to multi-file JSON storage. Data will NOT be in MongoDB.');
    return false;
  }
}

/**
 * Diagnostic tool to check database status
 */
export async function getDBStatus() {
  try {
    await connectDB();
    return { 
      connected: true, 
      type: 'MongoDB',
      host: process.env.MONGODB_URI?.split('@')?.[1]?.split('/')?.[0] || 'hidden'
    };
  } catch (error) {
    const stats = await getStorageStats();
    return { 
      connected: false, 
      type: 'Multi-File JSON Storage', 
      error: error instanceof Error ? error.message : String(error),
      recommendation: "Using multi-file JSON storage system.",
      storageStats: stats
    };
  }
}

// PROPERTY OPERATIONS
export async function readProperties(): Promise<PropertyType[]> {
  const isDBConnected = await initDB();
  
  if (!isDBConnected) {
    logger.warn('DB Down: Reading properties from multi-file JSON storage.');
    return await readAllPlots() as any;
  }

  try {
    const data = await Property.find({}).sort({ createdAt: -1 }).lean();
    return data.map(doc => {
      const base: any = {
        id: doc._id?.toString() || '',
        propertyNumber: doc.propertyNumber || 'Unknown',
        propertyType: doc.propertyType || 'Plot',
        villageName: doc.villageName || 'Unknown',
        areaName: doc.areaName || 'Unknown',
        imageUrl: doc.imageUrl || '',
        imageHint: doc.imageHint || '',
        description: doc.description || '',
        price: doc.price || 0,
        priceNegotiable: doc.priceNegotiable || false,
        status: doc.status || 'Available',
        category: doc.category || 'Normal',
        images: doc.images || [],
        createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : (doc.createdAt || new Date().toISOString()),
        updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt.toISOString() : (doc.updatedAt || new Date().toISOString()),
      };

      if (doc.propertyType === 'Plot') {
        return {
          ...base,
          plotNumber: doc.propertyNumber,
          plotSize: doc.plotSize || '',
          plotFacing: doc.plotFacing || 'North',
          pricePerSqft: doc.pricePerSqft,
        };
      } else if (doc.propertyType === 'House') {
        return {
          ...base,
          houseSize: doc.houseSize || '',
          bedrooms: doc.bedrooms || 0,
          bathrooms: doc.bathrooms || 0,
          floors: doc.floors || 1,
          houseType: doc.houseType || 'Independent',
          furnished: doc.furnished || false,
          parking: doc.parking || false,
          amenities: doc.amenities || [],
          yearBuilt: doc.yearBuilt,
        };
      } else {
        return {
          ...base,
          landSize: doc.landSize || '',
          landType: doc.landType || 'Residential',
          zoning: doc.zoning || '',
          roadAccess: doc.roadAccess || false,
          waterConnection: doc.waterConnection || false,
          electricityConnection: doc.electricityConnection || false,
          soilType: doc.soilType,
          topography: doc.topography,
        };
      }
    });
  } catch (error) {
    logger.error('MongoDB read failed, falling back to multi-file JSON:', error);
    return await readAllPlots() as any;
  }
}

// Alias for compatibility
export const readPlots = readProperties;

export async function createProperty(propertyData: Omit<PropertyType, 'id' | 'createdAt'>): Promise<PropertyType> {
  const isDBConnected = await initDB();
  const id = Math.random().toString(36).substring(2, 9);
  const now = new Date().toISOString();
  
  const newProperty: PropertyType = {
    id,
    ...propertyData,
    createdAt: now,
    updatedAt: now,
  } as any;

  // Attempt multi-file write but don't crash if it fails (Vercel)
  try {
    if (propertyData.propertyType === 'Plot') {
      await createPlotMultiFile(propertyData as any);
    }
  } catch (err) {
    logger.warn('Multi-file plot save failed (Vercel?):', err);
  }

  if (isDBConnected) {
    try {
      const doc = new Property({
        _id: id,
        ...propertyData,
      });
      await doc.save();
      logger.info('✅ Property saved to MongoDB');
    } catch (err) {
      logger.error('MongoDB property save failed:', err);
    }
  }

  return newProperty;
}

// Alias for compatibility
export const createPlot = createProperty;

export async function updateProperty(id: string, updateData: Partial<PropertyType>): Promise<PropertyType | null> {
  const isDBConnected = await initDB();

  // Multi-file update attempt
  try {
    if (updateData.propertyType === 'Plot' || !updateData.propertyType) {
      await updatePlotMultiFile(id, updateData as any);
    }
  } catch (err) {
    logger.warn('Multi-file update failed:', err);
  }

  if (isDBConnected) {
    try {
      await Property.findByIdAndUpdate(id, {
        ...updateData,
        updatedAt: new Date(),
      });
      logger.info('✅ Property updated in MongoDB');
      return await getProperty(id);
    } catch (err) {
      logger.error('MongoDB property update failed:', err);
    }
  }

  // Fallback if DB down (though imperfect for non-plots)
  return await getProperty(id);
}

// Alias for compatibility
export const updatePlot = updateProperty;

export async function getProperty(id: string): Promise<PropertyType | null> {
  const isDBConnected = await initDB();
  if (!isDBConnected) {
    const plots = await readAllPlots();
    return plots.find(p => p.id === id) as any || null;
  }

  try {
    const doc = await Property.findById(id).lean();
    if (!doc) return null;
    
    // Use the same mapping as readProperties
    const base: any = {
      id: doc._id.toString(),
      propertyNumber: doc.propertyNumber,
      propertyType: doc.propertyType,
      villageName: doc.villageName,
      areaName: doc.areaName,
      imageUrl: doc.imageUrl || '',
      imageHint: doc.imageHint || '',
      description: doc.description || '',
      price: doc.price || 0,
      priceNegotiable: doc.priceNegotiable || false,
      status: doc.status || 'Available',
      category: doc.category || 'Normal',
      images: doc.images || [],
      views: doc.views || 0,
      lastViewedAt: doc.lastViewedAt?.toISOString(),
      createdAt: doc.createdAt?.toISOString(),
      updatedAt: doc.updatedAt?.toISOString(),
    };

    if (doc.propertyType === 'Plot') {
      return {
        ...base,
        plotNumber: doc.propertyNumber,
        plotSize: doc.plotSize || '',
        plotFacing: doc.plotFacing || 'North',
        pricePerSqft: doc.pricePerSqft,
      };
    } else if (doc.propertyType === 'House') {
      return {
        ...base,
        houseSize: doc.houseSize || '',
        bedrooms: doc.bedrooms || 0,
        bathrooms: doc.bathrooms || 0,
        floors: doc.floors || 1,
        houseType: doc.houseType || 'Independent',
        furnished: doc.furnished || false,
        parking: doc.parking || false,
        amenities: doc.amenities || [],
        yearBuilt: doc.yearBuilt,
      };
    } else {
      return {
        ...base,
        landSize: doc.landSize || '',
        landType: doc.landType || 'Residential',
        zoning: doc.zoning || '',
        roadAccess: doc.roadAccess || false,
        waterConnection: doc.waterConnection || false,
        electricityConnection: doc.electricityConnection || false,
        soilType: doc.soilType,
        topography: doc.topography,
      };
    }
  } catch (error) {
    logger.error('MongoDB getProperty failed:', error);
    const plots = await readAllPlots();
    return plots.find(p => p.id === id) as any || null;
  }
}

export async function incrementPropertyViews(id: string): Promise<boolean> {
  const isDBConnected = await initDB();
  if (isDBConnected) {
    try {
      await Property.findByIdAndUpdate(id, {
        $inc: { views: 1 },
        $set: { lastViewedAt: new Date() }
      });
      return true;
    } catch (err) {
      logger.error('MongoDB increment views failed:', err);
    }
  }
  return false;
}

export async function deleteProperty(id: string): Promise<boolean> {
  const isDBConnected = await initDB();

  try {
    await deletePlotMultiFile(id);
  } catch (err) {
    logger.warn('Multi-file delete failed:', err);
  }

  if (isDBConnected) {
    try {
      const result = await Property.findByIdAndDelete(id);
      logger.info('✅ Property deleted from MongoDB');
      return !!result;
    } catch (err) {
      logger.error('MongoDB property delete failed:', err);
    }
  }

  return true;
}

// Alias for compatibility
export const deletePlot = deleteProperty;

export async function writePlots(plots: PlotType[]): Promise<void> {
  // Always attempt JSON write but don't crash
  await writeJsonFile<PlotType>(JSON_FILES.PLOTS, plots);
}

// USER MANAGEMENT FUNCTIONS

// USER OPERATIONS
export async function updateUserProfile(email: string, profileData: { name?: string; phone?: string; location?: string }): Promise<UserType | null> {
  const isDBConnected = await initDB();
  
  if (isDBConnected) {
    try {
      const user = await User.findOneAndUpdate(
        { email: email.toLowerCase() },
        { 
          $set: { 
            ...profileData,
            updatedAt: new Date()
          } 
        },
        { new: true }
      );
      
      if (user) {
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role as any,
          name: user.name,
          phone: user.phone,
          location: user.location,
        };
      }
    } catch (err) {
      logger.error('MongoDB user profile update failed:', err);
    }
  }
  return null;
}

export async function readUsers(): Promise<UserType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<UserType>(JSON_FILES.USERS);

  try {
    const users = await User.find({}).lean();
    return users.map(user => ({
      id: user._id?.toString() || '',
      email: user.email || '',
      role: (user.role as any) || 'User',
      name: user.name || '',
      phone: user.phone || '',
      location: user.location || '',
      createdAt: user.createdAt instanceof Date ? user.createdAt.toISOString() : (user.createdAt || new Date().toISOString()),
    }));
  } catch {
    return await readJsonFile<UserType>(JSON_FILES.USERS);
  }
}

export async function writeUsers(users: UserType[]): Promise<void> {
  await writeJsonFile<UserType>(JSON_FILES.USERS, users);
}

export async function createUser(userData: Omit<UserType, 'id'>): Promise<UserType> {
  const isDBConnected = await initDB();
  const id = Math.random().toString(36).substring(2, 9);
  const newUser = { id, ...userData };

  try {
    const users = await readJsonFile<UserType>(JSON_FILES.USERS);
    await writeJsonFile<UserType>(JSON_FILES.USERS, [...users, newUser]);
  } catch (err) {
    logger.warn('JSON user creation failed:', err);
  }

  if (isDBConnected) {
    try {
      const user = await User.create({
        _id: id,
        ...userData
      });
      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role as any,
      };
    } catch (err) { 
      logger.error('MongoDB user creation failed:', err);
    }
  }

  return newUser;
}

export async function deleteUser(id: string): Promise<boolean> {
  const isDBConnected = await initDB();

  const users = await readJsonFile<UserType>(JSON_FILES.USERS);
  await writeJsonFile<UserType>(JSON_FILES.USERS, users.filter(u => u.id !== id));

  if (isDBConnected) {
    try {
      const result = await User.findByIdAndDelete(id);
      return !!result;
    } catch { }
  }
  return true;
}

// REGISTRATION OPERATIONS
export async function readRegistrations(): Promise<RegistrationType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS);

  try {
    const registrations = await Registration.find({}).sort({ createdAt: -1 }).lean();
    return registrations.map(reg => ({
      id: reg._id?.toString() || '',
      name: reg.name || 'Unknown',
      phone: reg.phone || '',
      email: reg.email || '',
      notes: reg.notes || '',
      isNew: reg.isUnread ?? true,
      createdAt: reg.createdAt instanceof Date ? reg.createdAt.toISOString() : (reg.createdAt || new Date().toISOString()),
    }));
  } catch {
    return await readJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS);
  }
}

export async function writeRegistrations(registrations: RegistrationType[]): Promise<void> {
  await writeJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS, registrations);
}

export async function createRegistration(regData: Omit<RegistrationType, 'id'>): Promise<RegistrationType> {
  const id = Math.random().toString(36).substring(2, 9);
  const newReg = { id, ...regData };

  try {
    const isDBConnected = await initDB();
    if (isDBConnected) {
      const { isNew, ...rest } = regData;
      const registration = await Registration.create({
        _id: id,
        ...rest,
        isUnread: true
      });
      
      return {
        id: registration._id.toString(),
        ...regData,
      };
    }
  } catch (err) {
    logger.error('Registration: MongoDB creation failed, falling back to mock.', err);
  }

  return newReg;
}

export async function markRegistrationsAsRead(): Promise<void> {
  const isDBConnected = await initDB();

  const regs = await readJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS);
  regs.forEach(r => r.isNew = false);
  await writeJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS, regs);

  if (isDBConnected) {
    try {
      // Schema field is 'isUnread', not 'isNew'
      await Registration.updateMany({ isUnread: true }, { isUnread: false });
    } catch (err) {
      logger.error('Failed to mark registrations as read:', err);
    }
  }
}

// INQUIRY OPERATIONS
export async function readInquiries(): Promise<InquiryType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<InquiryType>(JSON_FILES.INQUIRIES);

  try {
    const inquiries = await Inquiry.find({}).sort({ receivedAt: -1 }).lean();
    return inquiries.map(inq => ({
      id: inq._id?.toString() || '',
      plotNumber: inq.plotNumber || '',
      name: inq.name || 'Unknown',
      email: inq.email || '',
      message: inq.message || '',
      receivedAt: inq.receivedAt instanceof Date ? inq.receivedAt.toISOString() : (inq.receivedAt || new Date().toISOString()),
    }));
  } catch {
    return await readJsonFile<InquiryType>(JSON_FILES.INQUIRIES);
  }
}

export async function writeInquiries(inquiries: InquiryType[]): Promise<void> {
  await writeJsonFile<InquiryType>(JSON_FILES.INQUIRIES, inquiries);
}

export async function createInquiry(inqData: Omit<InquiryType, 'id'>): Promise<InquiryType> {
  const isDBConnected = await initDB();
  const id = Math.random().toString(36).substring(2, 9);
  const newInq = { id, ...inqData };

  try {
    const inquiries = await readJsonFile<InquiryType>(JSON_FILES.INQUIRIES);
    await writeJsonFile<InquiryType>(JSON_FILES.INQUIRIES, [newInq, ...inquiries]);
  } catch (err) {
    logger.warn('JSON inquiry save failed:', err);
  }

  if (isDBConnected) {
    try {
      const inquiry = await Inquiry.create({
        _id: id,
        ...inqData
      });
      return {
        id: inquiry._id.toString(),
        ...inqData,
      };
    } catch (err) { 
      logger.error('MongoDB inquiry save failed:', err);
    }
  }
  return newInq;
}

// CONTACT OPERATIONS
export async function readContacts(): Promise<ContactType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<ContactType>(JSON_FILES.CONTACTS);

  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return contacts.map(contact => ({
      id: contact._id?.toString() || '',
      name: contact.name || 'Unknown',
      phone: contact.phone || '',
      email: contact.email || '',
      type: (contact.type as any) || 'Other',
      notes: contact.notes || '',
    }));
  } catch {
    return await readJsonFile<ContactType>(JSON_FILES.CONTACTS);
  }
}

export async function writeContacts(contacts: ContactType[]): Promise<void> {
  await writeJsonFile<ContactType>(JSON_FILES.CONTACTS, contacts);
}

export async function createContact(contactData: Omit<ContactType, 'id'>): Promise<ContactType> {
  const isDBConnected = await initDB();
  const id = Math.random().toString(36).substring(2, 9);
  const newContact = { id, ...contactData };

  try {
    const contacts = await readJsonFile<ContactType>(JSON_FILES.CONTACTS);
    await writeJsonFile<ContactType>(JSON_FILES.CONTACTS, [...contacts, newContact]);
  } catch (err) {
    logger.warn('JSON contact save failed:', err);
  }

  if (isDBConnected) {
    try {
      const contact = await Contact.create({
        _id: id,
        ...contactData
      });
      return {
        id: contact._id.toString(),
        ...contactData,
      };
    } catch (err) { 
      logger.error('MongoDB contact save failed:', err);
    }
  }
  return newContact;
}

export async function updateContact(id: string, contactData: Partial<ContactType>): Promise<ContactType | null> {
  const isDBConnected = await initDB();

  const contacts = await readJsonFile<ContactType>(JSON_FILES.CONTACTS);
  const index = contacts.findIndex(c => c.id === id);
  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...contactData };
    await writeJsonFile<ContactType>(JSON_FILES.CONTACTS, contacts);
  }

  if (isDBConnected) {
    try {
      const contact = await Contact.findByIdAndUpdate(id, contactData, { new: true }).lean();
      if (!contact) return null;
      return {
        id: contact._id.toString(),
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        type: contact.type as 'Seller' | 'Buyer',
        notes: contact.notes,
      };
    } catch { }
  }
  return index !== -1 ? contacts[index] : null;
}

export async function deleteContact(id: string): Promise<boolean> {
  const isDBConnected = await initDB();

  const contacts = await readJsonFile<ContactType>(JSON_FILES.CONTACTS);
  await writeJsonFile<ContactType>(JSON_FILES.CONTACTS, contacts.filter(c => c.id !== id));

  if (isDBConnected) {
    try {
      const result = await Contact.findByIdAndDelete(id);
      return !!result;
    } catch { }
  }
  return true;
}

// PASSWORD OPERATIONS
export async function getPassword(email: string): Promise<string | null> {
  // Try MongoDB first (works in production on Vercel)
  const isDBConnected = await initDB();
  if (isDBConnected) {
    try {
      const password = await Password.findOne({ email: email.toLowerCase() }).lean();
      if (password) return password.hashedPassword;
    } catch (err) {
      logger.warn('MongoDB password lookup failed, falling back to local JSON:', err);
    }
  }

  // Fallback: check local JSON file (works in local dev)
  const passwords = await readJsonFile<any>(JSON_FILES.PASSWORDS);
  const entry = passwords.find((p: any) => p.email === email || p.email === email.toLowerCase());
  if (entry) {
    return entry.hashedPassword;
  }

  return null;
}

export async function setPassword(email: string, hashedPassword: string): Promise<void> {
  const isDBConnected = await initDB();

  const passwords = await readJsonFile<any>(JSON_FILES.PASSWORDS);
  const index = passwords.findIndex((p: any) => p.email === email);
  if (index !== -1) {
    passwords[index].hashedPassword = hashedPassword;
  } else {
    passwords.push({ email, hashedPassword });
  }
  await writeJsonFile<any>(JSON_FILES.PASSWORDS, passwords);

  if (isDBConnected) {
    try {
      await Password.findOneAndUpdate(
        { email },
        { hashedPassword, updatedAt: new Date() },
        { upsert: true }
      );
    } catch { }
  }
}
