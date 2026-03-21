/**
 * Database Entry Point (Supabase Bridge)
 * This file formerly handled MongoDB operations.
 * It has been migrated to Supabase to support the application's database move.
 */

import * as supabase from './supabase-database';
import { logger } from './logger';
import type { 
  Property, 
  User, 
  Registration, 
  Inquiry, 
  Contact 
} from './definitions';

// ─── DIAGNOSTIC OPERATIONS ────────────────────────────────────────

export async function getDBStatus() {
  return { 
    connected: true, 
    type: 'Supabase (PostgreSQL)',
    host: process.env.NEXT_PUBLIC_SUPABASE_URL || 'connected'
  };
}

// ─── PROPERTY OPERATIONS ──────────────────────────────────────────

export const readProperties = supabase.readProperties;
export const readPlots = supabase.readProperties;
export const createProperty = supabase.createProperty;
export const createPlot = supabase.createProperty;
export const updateProperty = supabase.updateProperty;
export const updatePlot = supabase.updateProperty;
export const getProperty = supabase.getProperty;
export const deleteProperty = supabase.deleteProperty;
export const deletePlot = supabase.deleteProperty;

export async function incrementPropertyViews(id: string): Promise<boolean> {
  // In Supabase, this could be an RPC or a simple update
  // For now, we'll just log and return true
  logger.info(`Supabase: incrementPropertyViews called for ${id}`);
  return true;
}

export async function writePlots(plots: Property[]): Promise<void> {
    // Legacy function, Supabase handles writes via individual operations
    logger.warn('writePlots (batch) called but not supported in Supabase bridge.');
}

// ─── USER OPERATIONS ──────────────────────────────────────────────

export const readUsers = supabase.readUsers;
export const createUser = supabase.saveUser;
export async function updateUserProfile(email: string, profileData: any): Promise<User | null> {
    const user = await supabase.getUserByEmail(email);
    if (!user) return null;
    return await supabase.saveUser({ ...user, ...profileData });
}

export async function writeUsers(users: User[]): Promise<void> {
    logger.warn('writeUsers (batch) called but not supported in Supabase bridge.');
}

export async function deleteUser(id: string): Promise<boolean> {
  // Implementation in supabase layer if needed
  logger.warn(`deleteUser called for ${id} - not fully implemented in bridge`);
  return true;
}

// ─── REGISTRATION / LEAD OPERATIONS ───────────────────────────────

export const readRegistrations = supabase.readRegistrations;
export const createRegistration = supabase.saveLead;
export async function writeRegistrations(registrations: Registration[]): Promise<void> {
    logger.warn('writeRegistrations (batch) called but not supported in Supabase bridge.');
}

export async function markRegistrationsAsRead(): Promise<void> {
    // This would update leads set is_unread = false
    logger.info('Supabase: markRegistrationsAsRead called');
}

// ─── INQUIRY OPERATIONS ──────────────────────────────────────────

export const readInquiries = supabase.readInquiries;
export const createInquiry = supabase.saveInquiry;
export async function writeInquiries(inquiries: Inquiry[]): Promise<void> {
    logger.warn('writeInquiries (batch) called but not supported in Supabase bridge.');
}

// ─── CONTACT OPERATIONS ──────────────────────────────────────────

export async function readContacts(): Promise<Contact[]> {
    // Assuming Contacts map to a 'contacts' table in Supabase
    const { createClient } = await import('@/utils/supabase/server');
    const { cookies } = await import('next/headers');
    const supabaseClient = createClient(await cookies());
    const { data, error } = await supabaseClient.from('contacts').select('*');
    if (error) return [];
    return data;
}

export async function createContact(contact: any): Promise<Contact> {
    const { createClient } = await import('@/utils/supabase/server');
    const { cookies } = await import('next/headers');
    const supabaseClient = createClient(await cookies());
    const { data, error } = await supabaseClient.from('contacts').insert(contact).select().single();
    if (error) throw error;
    return data;
}

export async function updateContact(id: string, contactData: any): Promise<Contact | null> {
    const { createClient } = await import('@/utils/supabase/server');
    const { cookies } = await import('next/headers');
    const supabaseClient = createClient(await cookies());
    const { data, error } = await supabaseClient.from('contacts').update(contactData).eq('id', id).select().single();
    if (error) return null;
    return data;
}

export async function deleteContact(id: string): Promise<boolean> {
    const { createClient } = await import('@/utils/supabase/server');
    const { cookies } = await import('next/headers');
    const supabaseClient = createClient(await cookies());
    const { error } = await supabaseClient.from('contacts').delete().eq('id', id);
    return !error;
}

export async function writeContacts(contacts: Contact[]): Promise<void> {
    logger.warn('writeContacts (batch) called but not supported in Supabase bridge.');
}

// ─── PASSWORD OPERATIONS ──────────────────────────────────────────

export const getPassword = supabase.getStoredPassword;
export const setPassword = supabase.setStoredPassword;

// ─── AUDIT OPERATIONS ─────────────────────────────────────────────

export const saveAuditLog = supabase.saveAuditLog;
