/**
 * Password storage using MongoDB
 * Replaces file-based storage for production deployment
 */
import { getStoredPassword as getPasswordDB, setStoredPassword as setPasswordDB } from './supabase-database';
import fs from 'fs/promises';
import path from 'path';
import { logger } from './logger';

const passwordDataPath = path.join(process.cwd(), 'src', 'lib', 'password-data.json');

async function getLocalPassword(email: string): Promise<string | null> {
  try {
    const content = await fs.readFile(passwordDataPath, 'utf8');
    const passwords = JSON.parse(content);
    return passwords[email] || null;
  } catch (error) {
    // Silence error if file doesn't exist - it's a legacy fallback
    return null;
  }
}

export async function getPassword(email: string): Promise<string | null> {
  try {
    const dbPassword = await getPasswordDB(email);
    if (dbPassword) return dbPassword;
    
    // Fallback to local if not in Supabase (during migration period)
    return await getLocalPassword(email);
  } catch (error) {
    logger.warn(`Supabase password fetch failed for ${email}:`, error);
    return await getLocalPassword(email);
  }
}

export async function setPassword(email: string, hashedPassword: string): Promise<void> {
  try {
    await setPasswordDB(email, hashedPassword);
    logger.info(`✅ Password updated in Supabase for: ${email}`);
  } catch (error) {
    logger.error(`Supabase password save failed for ${email}:`, error);
    throw error;
  }
}
