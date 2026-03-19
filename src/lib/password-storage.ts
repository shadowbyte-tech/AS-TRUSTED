/**
 * Password storage using MongoDB
 * Replaces file-based storage for production deployment
 */
import { getPassword as getPasswordDB, setPassword as setPasswordDB } from './mongodb-database';
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
    logger.error('Failed to read local password data:', error);
    return null;
  }
}

export async function getPassword(email: string): Promise<string | null> {
  try {
    logger.info('🔐 GET PASSWORD CALLED FOR:', email);
    const dbPassword = await getPasswordDB(email);
    logger.info('🔐 DB PASSWORD RESULT:', dbPassword ? 'FOUND' : 'NOT FOUND');
    if (dbPassword) {
      logger.debug('🔐 DB PASSWORD HASH RETRIEVED');
      return dbPassword;
    }
    // Fallback to local if not in DB
    logger.info('🔐 FALLING BACK TO LOCAL STORAGE');
    const localPassword = await getLocalPassword(email);
    logger.info('🔐 LOCAL PASSWORD RESULT:', localPassword ? 'FOUND' : 'NOT FOUND');
    if (localPassword) {
      logger.debug('🔐 LOCAL PASSWORD HASH RETRIEVED');
    }
    return localPassword;
  } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.warn('MongoDB password fetch failed, falling back to local storage:', errorMessage);
    logger.info('🔐 FALLBACK TO LOCAL STORAGE DUE TO ERROR');
    const localPassword = await getLocalPassword(email);
      logger.debug('🔐 LOCAL PASSWORD HASH (ERROR FALLBACK)');
    return localPassword;
  }
}

export async function setPassword(email: string, hashedPassword: string): Promise<void> {
  try {
    await setPasswordDB(email, hashedPassword);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.warn('MongoDB password save failed:', errorMessage);
    // In dev, we don't necessarily need to write back to JSON automatically 
    // but the getPassword fallback will allow existing JSON passwords to work.
  }
}
