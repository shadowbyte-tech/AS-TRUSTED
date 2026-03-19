/**
 * Enhanced Authentication System
 * Provides secure password generation, validation, and user management
 */

import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { authenticateUser, registerUser, generateAccessToken, verifyToken } from './auth';
import { readUsers, createUser as createUserDB } from './mongodb-database';
import { setPassword } from './password-storage';

// Password generation options
interface PasswordOptions {
  length?: number;
  includeUppercase?: boolean;
  includeLowercase?: boolean;
  includeNumbers?: boolean;
  includeSymbols?: boolean;
  excludeSimilar?: boolean;
}

// Default password options
const DEFAULT_PASSWORD_OPTIONS: PasswordOptions = {
  length: 12,
  includeUppercase: true,
  includeLowercase: true,
  includeNumbers: true,
  includeSymbols: true,
  excludeSimilar: true,
};

// Character sets for password generation
const CHAR_SETS = {
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  numbers: '0123456789',
  symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
  similar: 'il1Lo0O', // Characters to exclude if excludeSimilar is true
};

/**
 * Generates a secure random password
 */
export function generateSecurePassword(options: PasswordOptions = {}): string {
  const opts = { ...DEFAULT_PASSWORD_OPTIONS, ...options };
  let charset = '';
  let password = '';

  // Build character set
  if (opts.includeUppercase) charset += CHAR_SETS.uppercase;
  if (opts.includeLowercase) charset += CHAR_SETS.lowercase;
  if (opts.includeNumbers) charset += CHAR_SETS.numbers;
  if (opts.includeSymbols) charset += CHAR_SETS.symbols;

  // Remove similar characters if requested
  if (opts.excludeSimilar) {
    for (const char of CHAR_SETS.similar) {
      charset = charset.replace(new RegExp(char, 'g'), '');
    }
  }

  if (charset.length === 0) {
    throw new Error('No character set available for password generation');
  }

  // Generate password ensuring at least one character from each required set
  const requiredChars: string[] = [];
  if (opts.includeUppercase) requiredChars.push(getRandomChar(CHAR_SETS.uppercase));
  if (opts.includeLowercase) requiredChars.push(getRandomChar(CHAR_SETS.lowercase));
  if (opts.includeNumbers) requiredChars.push(getRandomChar(CHAR_SETS.numbers));
  if (opts.includeSymbols) requiredChars.push(getRandomChar(CHAR_SETS.symbols));

  // Fill remaining length with random characters
  const remainingLength = (opts.length || 12) - requiredChars.length;
  for (let i = 0; i < remainingLength; i++) {
    requiredChars.push(getRandomChar(charset));
  }

  // Shuffle the password characters
  password = shuffleArray(requiredChars).join('');

  return password;
}

/**
 * Gets a random character from a string
 */
function getRandomChar(str: string): string {
  return str.charAt(Math.floor(Math.random() * str.length));
}

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Advanced password strength validation
 */
export interface PasswordStrengthResult {
  score: number; // 0-100
  strength: 'Very Weak' | 'Weak' | 'Fair' | 'Good' | 'Strong' | 'Very Strong';
  feedback: string[];
  isValid: boolean;
}

export function validatePasswordStrength(password: string): PasswordStrengthResult {
  const feedback: string[] = [];
  let score = 0;

  if (!password) {
    return {
      score: 0,
      strength: 'Very Weak',
      feedback: ['Password is required'],
      isValid: false,
    };
  }

  // Length scoring
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 10;
  if (password.length >= 16) score += 10;
  if (password.length < 8) feedback.push('Password should be at least 8 characters long');

  // Character variety scoring
  if (/[a-z]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Add lowercase letters');
  }

  if (/[A-Z]/.test(password)) {
    score += 10;
  } else {
    feedback.push('Add uppercase letters');
  }

  if (/\d/.test(password)) {
    score += 10;
  } else {
    feedback.push('Add numbers');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 15;
  } else {
    feedback.push('Add special characters (!@#$%^&*)');
  }

  // Pattern checks
  if (!/(.)\1{2,}/.test(password)) {
    score += 10; // No repeated characters
  } else {
    feedback.push('Avoid repeated characters');
  }

  if (!/123|abc|qwe|password|admin/i.test(password)) {
    score += 10; // No common patterns
  } else {
    feedback.push('Avoid common patterns or words');
  }

  // Entropy bonus
  const uniqueChars = new Set(password).size;
  if (uniqueChars >= password.length * 0.7) {
    score += 15; // Good character diversity
  }

  // Determine strength level
  let strength: PasswordStrengthResult['strength'];
  if (score >= 90) strength = 'Very Strong';
  else if (score >= 75) strength = 'Strong';
  else if (score >= 60) strength = 'Good';
  else if (score >= 40) strength = 'Fair';
  else if (score >= 20) strength = 'Weak';
  else strength = 'Very Weak';

  return {
    score: Math.min(100, score),
    strength,
    feedback,
    isValid: score >= 60 && password.length >= 8,
  };
}

/**
 * Creates a user with generated password
 */
export async function createUserWithGeneratedPassword(
  email: string,
  role: 'User' | 'Owner' = 'User',
  passwordOptions?: PasswordOptions
): Promise<{ user: any; password: string; success: boolean; message: string }> {
  try {
    // Check if user already exists
    const users = await readUsers();
    const existingUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      return {
        user: null,
        password: '',
        success: false,
        message: 'User with this email already exists',
      };
    }

    // Generate secure password
    const generatedPassword = generateSecurePassword(passwordOptions);

    // Validate the generated password (should always pass)
    const validation = validatePasswordStrength(generatedPassword);
    if (!validation.isValid) {
      throw new Error('Generated password failed validation');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(generatedPassword, 12); // Higher rounds for admin-generated passwords

    // Store password
    await setPassword(email, hashedPassword);

    // Create user record
    const userData = { email, role };
    const savedUser = await createUserDB(userData);

    return {
      user: savedUser,
      password: generatedPassword, // Return plain password for admin to share
      success: true,
      message: 'User created successfully with generated password',
    };
  } catch (error) {
    console.error('Error creating user with generated password:', error);
    return {
      user: null,
      password: '',
      success: false,
      message: 'Failed to create user',
    };
  }
}

/**
 * Generates multiple password options for user to choose from
 */
export function generatePasswordOptions(count: number = 3): string[] {
  const options: string[] = [];
  const variations: PasswordOptions[] = [
    { length: 12, includeSymbols: true },
    { length: 14, includeSymbols: false },
    { length: 16, includeSymbols: true, excludeSimilar: false },
  ];

  for (let i = 0; i < count; i++) {
    const option = variations[i % variations.length];
    options.push(generateSecurePassword(option));
  }

  return options;
}

/**
 * Password reset token generation
 */
export function generatePasswordResetToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Email verification token generation
 */
export function generateEmailVerificationToken(): string {
  return crypto.randomBytes(20).toString('hex');
}

/**
 * Secure session ID generation
 */
export function generateSessionId(): string {
  return crypto.randomBytes(24).toString('base64url');
}

/**
 * Check if password has been compromised (basic implementation)
 */
export function isPasswordCompromised(password: string): boolean {
  // Basic check against common passwords
  const commonPasswords = [
    'password', '123456', '123456789', 'qwerty', 'abc123',
    'password123', 'admin', 'letmein', 'welcome', 'monkey',
    '1234567890', 'dragon', 'master', 'hello', 'freedom',
    'whatever', 'qazwsx', 'trustno1', 'jordan', 'harley',
  ];

  return commonPasswords.includes(password.toLowerCase());
}

/**
 * Generate a memorable but secure passphrase
 */
export function generatePassphrase(wordCount: number = 4): string {
  const words = [
    'apple', 'brave', 'chair', 'dance', 'eagle', 'flame', 'grace', 'happy',
    'island', 'jungle', 'knight', 'lemon', 'magic', 'noble', 'ocean', 'peace',
    'quiet', 'river', 'storm', 'tiger', 'unity', 'voice', 'water', 'youth',
    'zebra', 'anchor', 'bridge', 'castle', 'dream', 'energy', 'forest', 'garden',
  ];

  const selectedWords: string[] = [];
  const numbers = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  const symbols = ['!', '@', '#', '$', '%'][Math.floor(Math.random() * 5)];

  for (let i = 0; i < wordCount; i++) {
    const word = words[Math.floor(Math.random() * words.length)];
    selectedWords.push(word.charAt(0).toUpperCase() + word.slice(1));
  }

  return selectedWords.join('-') + numbers + symbols;
}

/**
 * Account lockout tracking
 */
interface LoginAttempt {
  email: string;
  timestamp: number;
  success: boolean;
  ip?: string;
}

const loginAttempts: Map<string, LoginAttempt[]> = new Map();
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

export function trackLoginAttempt(email: string, success: boolean, ip?: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  
  // Clean old attempts
  const recentAttempts = attempts.filter(a => now - a.timestamp < LOCKOUT_DURATION);
  
  // Add current attempt
  recentAttempts.push({ email, timestamp: now, success, ip });
  loginAttempts.set(email, recentAttempts);
  
  // Check if account should be locked
  const failedAttempts = recentAttempts.filter(a => !a.success);
  return failedAttempts.length < LOCKOUT_THRESHOLD;
}

export function isAccountLocked(email: string): boolean {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  const recentFailures = attempts.filter(a => 
    !a.success && now - a.timestamp < LOCKOUT_DURATION
  );
  
  return recentFailures.length >= LOCKOUT_THRESHOLD;
}

export function getRemainingLockoutTime(email: string): number {
  const now = Date.now();
  const attempts = loginAttempts.get(email) || [];
  const recentFailures = attempts.filter(a => !a.success);
  
  if (recentFailures.length < LOCKOUT_THRESHOLD) return 0;
  
  const oldestFailure = recentFailures[recentFailures.length - LOCKOUT_THRESHOLD];
  const unlockTime = oldestFailure.timestamp + LOCKOUT_DURATION;
  
  return Math.max(0, unlockTime - now);
}