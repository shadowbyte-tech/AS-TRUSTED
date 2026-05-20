/**
 * @file src/lib/auth.ts
 * Complete authentication system using ONLY MongoDB + bcryptjs + JWT.
 * All Supabase references removed.
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { connectDB, User, Password } from './models';
import { logger } from './logger';
import { AUTH_COOKIES, JWT_CONFIG, VALIDATION } from './constants';

const BCRYPT_SALT_ROUNDS = 12;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error('JWT_SECRET must be set and at least 32 characters long.');
  }
  return secret;
}

// ─── TYPES ────────────────────────────────────────────────────────────────────
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

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function validatePasswordStrength(password: string): void {
  if (password.length < VALIDATION.PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${VALIDATION.PASSWORD_MIN_LENGTH} characters`);
  }
  if (password.length > VALIDATION.PASSWORD_MAX_LENGTH) {
    throw new Error(`Password must be less than ${VALIDATION.PASSWORD_MAX_LENGTH} characters`);
  }
}

// ─── TOKEN OPERATIONS ────────────────────────────────────────────────────────
export function generateAccessToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET!,
    { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRES_IN, algorithm: 'HS256' }
  );
}

export function generateRefreshToken(user: AuthUser): string {
  return jwt.sign(
    { id: user.id },
    JWT_SECRET!,
    { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRES_IN, algorithm: 'HS256' }
  );
}

export function verifyToken(token: string): any {
  try {
    return jwt.verify(token, getJwtSecret(), { algorithms: ['HS256'] });
  } catch {
    return null;
  }
}

// ─── COOKIE OPERATIONS ───────────────────────────────────────────────────────
export async function setAuthCookies(user: AuthUser): Promise<{ accessToken: string; refreshToken: string }> {
  const accessToken  = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  const cookieStore  = await cookies();

  const cookieOpts = {
    httpOnly: true,
    secure:   IS_PRODUCTION,
    sameSite: 'strict' as const,
    path:     '/',
  };

  cookieStore.set(AUTH_COOKIES.ACCESS_TOKEN, accessToken, {
    ...cookieOpts,
    maxAge: AUTH_COOKIES.MAX_AGE_ACCESS,
  });

  cookieStore.set(AUTH_COOKIES.REFRESH_TOKEN, refreshToken, {
    ...cookieOpts,
    maxAge: AUTH_COOKIES.MAX_AGE_REFRESH,
  });

  // Persist refresh token to DB for rotation/invalidation
  await connectDB();
  await User.findByIdAndUpdate(user.id, { refreshToken });

  return { accessToken, refreshToken };
}

export async function clearAuthCookies(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
}

// ─── SESSION ─────────────────────────────────────────────────────────────────
export async function getSessionUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIES.ACCESS_TOKEN)?.value;
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded?.id) return null;

  try {
    await connectDB();
    const user = await User.findById(decoded.id).lean();
    if (!user || !user.isActive || user.isBlocked) return null;

    return {
      id:       String(user._id),
      email:    user.email,
      role:     user.role,
      name:     user.name,
      phone:    user.phone,
      location: user.location,
    };
  } catch (err) {
    logger.error('getSessionUser failed', err);
    return null;
  }
}

// ─── AUTHENTICATE (LOGIN) ────────────────────────────────────────────────────
export async function authenticateUser(credentials: LoginCredentials): Promise<AuthUser | null> {
  const { email, password } = credentials;
  if (!email || !password) throw new Error('Email and password are required');

  await connectDB();

  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  if (!user || user.isBlocked || !user.isActive) return null;

  const passwordDoc = await Password.findOne({ email: email.toLowerCase() }).select('+hashedPassword').lean();
  if (!passwordDoc) {
    logger.warn(`No password record found for: ${email}`);
    return null;
  }

  const valid = await bcrypt.compare(password, passwordDoc.hashedPassword);
  if (!valid) return null;

  // Update last login time
  await User.findByIdAndUpdate(user._id, { lastLoginAt: new Date() });

  return {
    id:       String(user._id),
    email:    user.email,
    role:     user.role,
    name:     user.name,
    phone:    user.phone,
    location: user.location,
  };
}

export async function authenticateOwner(credentials: LoginCredentials): Promise<AuthUser | null> {
  const user = await authenticateUser(credentials);
  if (!user || user.role !== 'Owner') return null;
  return user;
}

// ─── REGISTER ────────────────────────────────────────────────────────────────
export async function registerUser(data: RegisterData): Promise<AuthUser> {
  const { email, password, name, role = 'User' } = data;
  if (!email || !password) throw new Error('Email and password are required');

  validatePasswordStrength(password);
  await connectDB();

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) throw new Error('A user with this email already exists');

  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  const user = await User.create({ email: email.toLowerCase(), role, name });
  await Password.create({ email: email.toLowerCase(), hashedPassword });

  logger.info(`✅ User registered: ${email}`);

  return {
    id:    String(user._id),
    email: user.email,
    role:  user.role,
    name:  user.name,
  };
}

// ─── CHANGE PASSWORD ─────────────────────────────────────────────────────────
export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  validatePasswordStrength(newPassword);
  await connectDB();

  const user = await User.findById(userId).lean();
  if (!user) throw new Error('User not found');

  const passwordDoc = await Password.findOne({ email: user.email }).select('+hashedPassword').lean();
  if (!passwordDoc) throw new Error('No password record found');

  const valid = await bcrypt.compare(currentPassword, passwordDoc.hashedPassword);
  if (!valid) throw new Error('Current password is incorrect');

  const hashed = await bcrypt.hash(newPassword, BCRYPT_SALT_ROUNDS);
  await Password.findOneAndUpdate({ email: user.email }, { hashedPassword: hashed });
}

// ─── GET USER BY EMAIL (utility) ─────────────────────────────────────────────
export async function getUserByEmail(email: string): Promise<AuthUser | null> {
  await connectDB();
  const user = await User.findOne({ email: email.toLowerCase() }).lean();
  if (!user) return null;
  return {
    id:       String(user._id),
    email:    user.email,
    role:     user.role,
    name:     user.name,
    phone:    user.phone,
    location: user.location,
  };
}
