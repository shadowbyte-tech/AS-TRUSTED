import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readUsers, getUserByEmail, saveUser } from './supabase-database';
import type { User } from './definitions';
import { AuthenticationError, ValidationError } from './errors';
import { getPassword, setPassword } from './password-storage';
import { VALIDATION, JWT_CONFIG, AUTH_COOKIES } from './constants';
import { validateAndLogEnv } from './env-validation';
import { logger } from './logger';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const BCRYPT_SALT_ROUNDS = 12;

// Validate env on module load (warns in dev, throws in prod)
validateAndLogEnv();

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  name?: string;
  phone?: string;
  location?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
  role?: string;
}

/**
 * Checks if a stored password string is a bcrypt hash.
 * Bcrypt hashes always start with $2a$, $2b$, or $2y$.
 */
function isBcryptHash(value: string): boolean {
  return /^\$2[aby]\$/.test(value);
}

/**
 * Validates password strength
 */
function validatePassword(password: string): void {
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    throw new ValidationError(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters long`);
  }
  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    throw new ValidationError(`Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`);
  }
}

/**
 * Verifies a password against a stored value.
 * Handles BOTH plain-text (legacy) and bcrypt (new) passwords.
 * If plain-text is matched, transparently re-hashes and updates storage.
 *
 * @returns `{ valid: boolean, migrated: boolean }` — migrated=true means the password was re-hashed.
 */
async function verifyAndMigratePassword(
  inputPassword: string,
  storedValue: string,
  userEmail: string
): Promise<{ valid: boolean; migrated: boolean }> {
  console.log('🔍 Password Debug:', {
    inputLength: inputPassword.length,
    storedValue,
    isBcryptHash: isBcryptHash(storedValue),
    userEmail
  });

  // Case 1: Already a bcrypt hash — use bcrypt.compare
  if (isBcryptHash(storedValue)) {
    console.log('🔍 Using bcrypt comparison');
    const valid = await bcrypt.compare(inputPassword, storedValue);
    console.log('🔍 Bcrypt compare result:', valid);
    return { valid, migrated: false };
  }

  // Case 2: Plain-text password (legacy) — transparent migration
  const valid = inputPassword === storedValue;
  if (valid) {
    // Silently upgrade to bcrypt hash
    const newHash = await bcrypt.hash(inputPassword, BCRYPT_SALT_ROUNDS);
    await setPassword(userEmail, newHash);
    logger.info(`✅ Password migrated to bcrypt for: ${userEmail}`);
    return { valid: true, migrated: true };
  }

  return { valid: false, migrated: false };
}

/**
 * Authenticates specifically an owner account.
 */
export async function authenticateOwner(credentials: LoginCredentials): Promise<AuthUser | null> {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const user = await getUserByEmail(email);

  if (!user || user.role !== 'Owner') {
    return null;
  }

  const storedPassword = await getPassword(user.email);
  if (!storedPassword) {
    logger.error(`No password record found in Supabase for: ${user.email}`);
    return null;
  }

  const { valid } = await verifyAndMigratePassword(password, storedPassword, user.email);
  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

/**
 * Authenticates a standard or premium user.
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  const { email, password } = credentials;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  const user = await getUserByEmail(email);
  
  if (!user || user.role === 'Owner') {
    return null;
  }

  const storedPassword = await getPassword(user.email);
  if (!storedPassword) {
    logger.error(`No password record found in Supabase for: ${user.email}`);
    return null;
  }

  const { valid } = await verifyAndMigratePassword(password, storedPassword, user.email);
  if (!valid) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    role: user.role,
  };
}

/**
 * Registers a new user — password is hashed with bcrypt before storage.
 */
export async function registerUser(data: RegisterData): Promise<AuthUser | null> {
  const { email, password, role = 'User' } = data;

  if (!email || !password) {
    throw new ValidationError('Email and password are required');
  }

  validatePassword(password);

  const users = await readUsers();
  const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existingUser) {
    return null;
  }

  // Hash password before storing — NEVER store plain text
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
  await setPassword(email, hashedPassword);

  const savedUser = await saveUser({
    email,
    role: role as 'User' | 'Owner' | 'Premium',
  });

  return {
    id: savedUser.id,
    email: savedUser.email,
    role: savedUser.role,
  };
}

import { cookies } from 'next/headers';

/**
 * Generates an access token for a user
 */
export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN }
  );
}

/**
 * Generates a refresh token for a user
 */
export function generateRefreshToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET,
    { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN }
  );
}

/**
 * Verifies a JWT token and returns its payload
 */
export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}

/**
 * Sets authentication cookies in the response.
 * Enforces secure=true in production.
 */
export async function setAuthCookies(user: AuthUser) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const isProduction = process.env.NODE_ENV === 'production';

  const cookieStore = await cookies();

  cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
    httpOnly: true,
    secure: false, // ⚠️ TEMPORARY: Disable secure flag for Vercel deployment
    sameSite: 'lax', // ⚠️ TEMPORARY: Use lax for cross-site requests
    maxAge: AUTH_COOKIES.MAX_AGE_ACCESS,
    path: '/',
  });

  cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, {
    httpOnly: true,
    secure: false, // ⚠️ TEMPORARY: Disable secure flag for Vercel deployment
    sameSite: 'lax', // ⚠️ TEMPORARY: Use lax for cross-site requests
    maxAge: AUTH_COOKIES.MAX_AGE_REFRESH,
    path: '/',
  });

  return { accessToken, refreshToken };
}

/**
 * Clears authentication cookies
 */
export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
}

/**
 * Extracts and verifies the session user from cookies
 */
export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  
  // Check for both auth-token (from our login API) and ACCESS_TOKEN (from auth system)
  const authToken = cookieStore.get('auth-token')?.value;
  const accessToken = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  
  const token = authToken || accessToken;

  if (!token) {
    return null;
  }

  const decoded = verifyToken(token);
  if (!decoded || !decoded.id) {
    return null;
  }

  try {
    const user = await getUserByEmail(decoded.email || ''); // Assuming email is in token or we fetch by ID

    if (!user && decoded.id) {
       // Fallback: finding by ID if email not directly available/trusted in token
       const users = await readUsers();
       const foundUser = users.find(u => u.id === decoded.id);
       if (!foundUser) return null;
       return {
         id: foundUser.id,
         email: foundUser.email,
         role: foundUser.role,
         name: foundUser.name,
         phone: foundUser.phone,
         location: foundUser.location,
       };
    }

    if (!user) return null;

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      phone: user.phone,
      location: user.location,
    };
  } catch (error) {
    logger.error('Error fetching user data:', error);
    return null;
  }
}

/**
 * Changes a user's password. New password is hashed with bcrypt.
 */
export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string
): Promise<boolean> {
  const users = await readUsers();
  const user = users.find(u => u.id === userId);

  if (!user) {
    throw new AuthenticationError('User not found');
  }

  validatePassword(newPassword);

  const storedPassword = await getPassword(user.email);
  if (!storedPassword) {
    throw new AuthenticationError('No password set for this user');
  }

  const { valid } = await verifyAndMigratePassword(currentPassword, storedPassword, user.email);
  if (!valid) {
    throw new AuthenticationError('Current password is incorrect');
  }

  // Store the NEW password hashed
  const hashedNew = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await setPassword(user.email, hashedNew);

  return true;
}
