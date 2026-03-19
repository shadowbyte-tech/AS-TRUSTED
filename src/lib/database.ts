
/**
 * @file Custom data layer for the application.
 * This provides a file-based data storage solution for development and small-scale deployments.
 * For production, consider migrating to PostgreSQL, MongoDB, or another production database.
 *
 * The data is exported from this file and imported into the server actions.
 * This ensures that all server actions are operating on the same data array in memory.
 */
import { promises as fs } from 'fs';
import path from 'path';
import type { Plot, User, Inquiry, Contact, Registration } from './definitions';
import { AppError } from './errors';

const plotDataPath = path.join(process.cwd(), 'src', 'lib', 'plot-data.json');
const inquiryDataPath = path.join(process.cwd(), 'src', 'lib', 'inquiry-data.json');
const registrationDataPath = path.join(process.cwd(), 'src', 'lib', 'registration-data.json');
const contactDataPath = path.join(process.cwd(), 'src', 'lib', 'contact-data.json');
const userDataPath = path.join(process.cwd(), 'src', 'lib', 'user-data.json');

// Helper function to safely read JSON files
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(fileContent) as T;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      // File doesn't exist, return default value
      return defaultValue;
    }
    console.error(`Failed to read file ${filePath}:`, error);
    throw new AppError(`Failed to read data from ${path.basename(filePath)}`);
  }
}

// Helper function to safely write JSON files
async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  try {
    // Ensure directory exists
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Failed to write file ${filePath}:`, error);
    throw new AppError(`Failed to save data to ${path.basename(filePath)}`);
  }
}

// Plot operations
export async function readPlots(): Promise<Plot[]> {
  return readJsonFile<Plot[]>(plotDataPath, []);
}

export async function writePlots(plots: Plot[]): Promise<void> {
  return writeJsonFile(plotDataPath, plots);
}

// Inquiry operations
export async function readInquiries(): Promise<Inquiry[]> {
  return readJsonFile<Inquiry[]>(inquiryDataPath, []);
}

export async function writeInquiries(inquiries: Inquiry[]): Promise<void> {
  return writeJsonFile(inquiryDataPath, inquiries);
}

// Registration operations
export async function readRegistrations(): Promise<Registration[]> {
  return readJsonFile<Registration[]>(registrationDataPath, []);
}

export async function writeRegistrations(registrations: Registration[]): Promise<void> {
  return writeJsonFile(registrationDataPath, registrations);
}

// Contact operations
export async function readContacts(): Promise<Contact[]> {
  return readJsonFile<Contact[]>(contactDataPath, [
    { id: 'con-1', name: 'Ravi Kumar', phone: '+91 98765 43210', email: 'ravi.k@example.com', type: 'Seller', notes: 'Has a 2400 sqft plot in Greenwood. Wants to sell quickly.' },
    { id: 'con-2', name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya.s@example.com', type: 'Buyer', notes: 'Looking for a North-facing plot in Sunrise Valley. Budget is flexible.' },
  ]);
}

export async function writeContacts(contacts: Contact[]): Promise<void> {
  return writeJsonFile(contactDataPath, contacts);
}

// User operations
export async function readUsers(): Promise<User[]> {
  return readJsonFile<User[]>(userDataPath, [
    { id: 'owner-1', email: 'swamy@consult.com', role: 'Owner' },
    { id: 'premium-1', email: 'premium@astrustedconsultancy.com', role: 'Premium' },
    { id: 'ecl5bhl', email: 'mani@consult.com', role: 'User' },
  ]);
}

export async function writeUsers(users: User[]): Promise<void> {
  return writeJsonFile(userDataPath, users);
}

// Legacy exports for backward compatibility
export const users: User[] = [
  { id: 'owner-1', email: 'swamy@consult.com', role: 'Owner' },
  { id: 'premium-1', email: 'premium@astrustedconsultancy.com', role: 'Premium' },
  { id: 'ecl5bhl', email: 'mani@consult.com', role: 'User' },
];

export const contacts: Contact[] = [
  { id: 'con-1', name: 'Ravi Kumar', phone: '+91 98765 43210', email: 'ravi.k@example.com', type: 'Seller', notes: 'Has a 2400 sqft plot in Greenwood. Wants to sell quickly.' },
  { id: 'con-2', name: 'Priya Sharma', phone: '+91 87654 32109', email: 'priya.s@example.com', type: 'Buyer', notes: 'Looking for a North-facing plot in Sunrise Valley. Budget is flexible.' },
];

export const registrations: Registration[] = [
  { id: 'reg-1', name: 'Arjun Mehra', phone: '+91 99887 76655', email: 'arjun.m@example.com', createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Interested in investment properties.', isNew: true },
  { id: 'reg-2', name: 'Sneha Patel', phone: '+91 88776 65544', email: 'sneha.p@example.com', createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), notes: 'First-time home buyer, needs guidance on the process.', isNew: true },
];

export async function updateOwnerProfile(email: string, profileData: { name?: string; phone?: string; location?: string }) {
  try {
    // Read current users
    const users = await readUsers();
    
    // Find and update the owner
    const updatedUsers = users.map(user => {
      if (user.email === email && user.role === 'Owner') {
        return {
          ...user,
          ...profileData,
          updatedAt: new Date().toISOString()
        };
      }
      return user;
    });
    
    // Write back to database
    await writeUsers(updatedUsers);
    
    // Return the updated user
    const updatedUser = updatedUsers.find(u => u.email === email && u.role === 'Owner');
    return updatedUser || null;
  } catch (error) {
    console.error('Error updating owner profile:', error);
    return null;
  }
}
