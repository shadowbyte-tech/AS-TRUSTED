/**
 * Client-side Enhanced Authentication Utilities
 * Safe for browser usage - no server-side dependencies
 */

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
 * Generates a secure random password (client-safe)
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