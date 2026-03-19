/**
 * MongoDB Database Operations
 * This replaces the JSON file-based database with MongoDB
 * 
 * RESILIENCE UPDATE: If MongoDB fails (e.g., ECONNREFUSED), 
 * it automatically falls back to multi-file JSON storage in the /data directory.
 */

import { connectDB, Plot, User, Registration, Inquiry, Contact, Password } from './models';
import type { Plot as PlotType, User as UserType, Registration as RegistrationType, Inquiry as InquiryType, Contact as ContactType } from './definitions';
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
  await ensureDataDir();
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
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

// PLOT OPERATIONS
export async function readPlots(): Promise<PlotType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) {
    logger.warn('DB Down: Reading plots from multi-file JSON storage.');
    return await readAllPlots();
  }

  try {
    const plots = await Plot.find({}).sort({ _id: -1 }).lean();
    return plots.map(plot => ({
      id: plot._id.toString(),
      plotNumber: plot.plotNumber,
      propertyNumber: plot.plotNumber, // Mapping for unified system
      propertyType: 'Plot' as const,
      villageName: plot.villageName,
      areaName: plot.areaName,
      plotSize: plot.plotSize,
      plotFacing: plot.plotFacing,
      imageUrl: plot.imageUrl,
      imageHint: plot.imageHint,
      description: plot.description,
      price: plot.price,
      pricePerSqft: plot.pricePerSqft,
      priceNegotiable: plot.priceNegotiable,
      status: plot.status,
      category: plot.category,
      createdAt: plot.createdAt?.toISOString(),
      updatedAt: plot.updatedAt?.toISOString(),
    }));
  } catch (error) {
    logger.error('MongoDB read failed, falling back to multi-file JSON:', error);
    return await readAllPlots();
  }
}

export async function createPlot(plotData: Omit<PlotType, 'id' | 'createdAt'>): Promise<PlotType> {
  const isDBConnected = await initDB();

  // Always update multi-file JSON storage first
  const newPlot = await createPlotMultiFile(plotData);

  if (isDBConnected) {
    try {
      const mongoPlot = new Plot({
        _id: newPlot.id,
        ...plotData
      });
      await mongoPlot.save();
      logger.info('✅ Plot saved to both MongoDB and multi-file JSON');
    } catch (err) {
      logger.error('MongoDB save failed, but multi-file JSON succeeded:', err);
    }
  }

  return newPlot;
}

export async function updatePlot(id: string, updateData: Partial<PlotType>): Promise<boolean> {
  const isDBConnected = await initDB();

  // Always update multi-file JSON storage first
  const jsonSuccess = await updatePlotMultiFile(id, updateData);

  if (isDBConnected) {
    try {
      const result = await Plot.findByIdAndUpdate(id, {
        ...updateData,
        updatedAt: new Date(),
      });
      logger.info('✅ Plot updated in both MongoDB and multi-file JSON');
      return !!result;
    } catch (err) {
      logger.error('MongoDB update failed, but multi-file JSON succeeded:', err);
    }
  }

  return jsonSuccess;
}

export async function deletePlot(id: string): Promise<boolean> {
  const isDBConnected = await initDB();

  // Always update multi-file JSON storage first
  const jsonSuccess = await deletePlotMultiFile(id);

  if (isDBConnected) {
    try {
      const result = await Plot.findByIdAndDelete(id);
      logger.info('✅ Plot deleted from both MongoDB and multi-file JSON');
      return !!result;
    } catch (err) {
      logger.error('MongoDB delete failed, but multi-file JSON succeeded:', err);
    }
  }

  return jsonSuccess;
}

export async function writePlots(plots: PlotType[]): Promise<void> {
  // Always update JSON for dual-mode durability
  await writeJsonFile<PlotType>(JSON_FILES.PLOTS, plots);
}

// USER MANAGEMENT FUNCTIONS

// USER OPERATIONS
export async function readUsers(): Promise<UserType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<UserType>(JSON_FILES.USERS);

  try {
    const users = await User.find({}).lean();
    return users.map(user => ({
      id: user._id.toString(),
      email: user.email,
      role: user.role as 'Owner' | 'User' | 'Premium',
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

  const users = await readJsonFile<UserType>(JSON_FILES.USERS);
  await writeJsonFile<UserType>(JSON_FILES.USERS, [...users, newUser]);

  if (isDBConnected) {
    try {
      const user = await User.create(userData);
      return {
        id: user._id.toString(),
        email: user.email,
        role: user.role as 'Owner' | 'User',
      };
    } catch { }
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
      id: reg._id.toString(),
      name: reg.name,
      phone: reg.phone,
      email: reg.email,
      notes: reg.notes,
      isNew: reg.isUnread,
      createdAt: reg.createdAt.toISOString(),
    }));
  } catch {
    return await readJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS);
  }
}

export async function writeRegistrations(registrations: RegistrationType[]): Promise<void> {
  await writeJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS, registrations);
}

export async function createRegistration(regData: Omit<RegistrationType, 'id'>): Promise<RegistrationType> {
  const isDBConnected = await initDB();
  const id = Math.random().toString(36).substring(2, 9);
  const newReg = { id, ...regData };

  const regs = await readJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS);
  await writeJsonFile<RegistrationType>(JSON_FILES.REGISTRATIONS, [newReg, ...regs]);

  if (isDBConnected) {
    try {
      const { isNew, ...rest } = regData;
      const registration = await Registration.create({
        ...rest,
        isUnread: isNew ?? true
      });
      return {
        id: registration._id.toString(),
        ...regData,
      };
    } catch { }
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
      await Registration.updateMany({ isNew: true }, { isNew: false });
    } catch { }
  }
}

// INQUIRY OPERATIONS
export async function readInquiries(): Promise<InquiryType[]> {
  const isDBConnected = await initDB();
  if (!isDBConnected) return await readJsonFile<InquiryType>(JSON_FILES.INQUIRIES);

  try {
    const inquiries = await Inquiry.find({}).sort({ receivedAt: -1 }).lean();
    return inquiries.map(inq => ({
      id: inq._id.toString(),
      plotNumber: inq.plotNumber,
      name: inq.name,
      email: inq.email,
      message: inq.message,
      receivedAt: inq.receivedAt.toISOString(),
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

  const inquiries = await readJsonFile<InquiryType>(JSON_FILES.INQUIRIES);
  await writeJsonFile<InquiryType>(JSON_FILES.INQUIRIES, [newInq, ...inquiries]);

  if (isDBConnected) {
    try {
      const inquiry = await Inquiry.create(inqData);
      return {
        id: inquiry._id.toString(),
        ...inqData,
      };
    } catch { }
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
      id: contact._id.toString(),
      name: contact.name,
      phone: contact.phone,
      email: contact.email,
      type: contact.type as 'Seller' | 'Buyer',
      notes: contact.notes,
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

  const contacts = await readJsonFile<ContactType>(JSON_FILES.CONTACTS);
  await writeJsonFile<ContactType>(JSON_FILES.CONTACTS, [...contacts, newContact]);

  if (isDBConnected) {
    try {
      const contact = await Contact.create(contactData);
      return {
        id: contact._id.toString(),
        ...contactData,
      };
    } catch { }
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
  // Always check local files first (our updated plain text passwords)
  const passwords = await readJsonFile<any>(JSON_FILES.PASSWORDS);
  const entry = passwords.find((p: any) => p.email === email);
  if (entry) {
    return entry.hashedPassword;
  }

  // Fallback to MongoDB if not found locally
  const isDBConnected = await initDB();
  if (!isDBConnected) {
    return null;
  }

  try {
    const password = await Password.findOne({ email }).lean();
    return password ? password.hashedPassword : null;
  } catch {
    return null;
  }
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
