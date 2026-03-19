import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitizes user input to prevent XSS attacks
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Sanitizes HTML content (for rich text areas if needed)
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  });
}

/**
 * Gets client IP address from request
 */
export function getClientIP(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  if (realIP) return realIP;
  if (cfConnectingIP) return cfConnectingIP;
  return '127.0.0.1';
}

/**
 * Validates file upload security
 */
export interface FileValidationOptions {
  maxSize?: number;
  allowedTypes?: string[];
  allowedExtensions?: string[];
}

export function validateFile(
  file: File,
  options: FileValidationOptions = {}
): { valid: boolean; error?: string } {
  const {
    maxSize = 4 * 1024 * 1024, // 4MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'],
  } = options;

  if (file.size > maxSize) {
    return { valid: false, error: `File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: `File type ${file.type} is not allowed.` };
  }

  const fileName = file.name.toLowerCase();
  if (!allowedExtensions.some(ext => fileName.endsWith(ext))) {
    return { valid: false, error: `File extension not allowed.` };
  }

  if (file.name.includes('..') || file.name.includes('/') || file.name.includes('\\')) {
    return { valid: false, error: 'Invalid file name' };
  }

  return { valid: true };
}

/**
 * Validates email format with additional security checks
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }

  if (email.length > 255) {
    return { valid: false, error: 'Email too long' };
  }

  const suspiciousPatterns = [/javascript:/i, /data:/i, /vbscript:/i, /<script/i, /on\w+=/i];
  for (const pattern of suspiciousPatterns) {
    if (pattern.test(email)) {
      return { valid: false, error: 'Invalid email format' };
    }
  }

  return { valid: true };
}

/**
 * Validates password strength
 */
export function validatePasswordStrength(password: string): {
  valid: boolean;
  score: number;
  feedback: string[];
} {
  const feedback: string[] = [];
  let score = 0;

  if (!password) return { valid: false, score: 0, feedback: ['Password is required'] };

  if (password.length < 8) {
    feedback.push('Password must be at least 8 characters long');
  } else {
    score += 1;
  }
  if (!/[a-z]/.test(password)) {
    feedback.push('Password must contain at least one lowercase letter');
  } else {
    score += 1;
  }
  if (!/[A-Z]/.test(password)) {
    feedback.push('Password must contain at least one uppercase letter');
  } else {
    score += 1;
  }
  if (!/\d/.test(password)) {
    feedback.push('Password must contain at least one number');
  } else {
    score += 1;
  }
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    feedback.push('Password must contain at least one special character');
  } else {
    score += 1;
  }

  const commonPasswords = ['password', '123456', '123456789', 'qwerty', 'abc123', 'password123', 'admin', 'letmein', 'welcome', 'monkey'];
  if (commonPasswords.includes(password.toLowerCase())) {
    feedback.push('Password is too common');
    score = Math.max(0, score - 2);
  }

  return { valid: score >= 4 && feedback.length === 0, score, feedback };
}

// ─── PRODUCTION-READY RATE LIMITER ──────────────────────────────────────────
// Uses an LRU-like Map to track requests. Works in serverless (no Redis needed).
// In-process only — for multi-instance scalability, replace with Redis.
// ─────────────────────────────────────────────────────────────────────────────

interface RateRecord {
  count: number;
  resetTime: number;
  blocked: boolean;
  blockUntil: number;
}

export class RateLimiter {
  private store: Map<string, RateRecord> = new Map();
  private readonly maxEntries: number;

  constructor(maxEntries = 10000) {
    this.maxEntries = maxEntries;
  }

  /**
   * Checks if a key (typically IP) is allowed to proceed.
   * @param key - unique identifier (IP address, user ID, etc.)
   * @param maxAttempts - maximum requests allowed per window
   * @param windowMs - window duration in milliseconds
   * @param blockDurationMs - how long to block after exceeding limit (default = rest of window)
   */
  isAllowed(key: string, maxAttempts: number, windowMs: number, blockDurationMs?: number): boolean {
    const now = Date.now();

    // Evict oldest entries when store is full (basic LRU behaviour)
    if (this.store.size >= this.maxEntries) {
      const firstKey = this.store.keys().next().value;
      if (firstKey) this.store.delete(firstKey);
    }

    const record = this.store.get(key);

    // No record yet, or window has expired
    if (!record || now > record.resetTime) {
      this.store.set(key, {
        count: 1,
        resetTime: now + windowMs,
        blocked: false,
        blockUntil: 0,
      });
      return true;
    }

    // Currently blocked
    if (record.blocked && now < record.blockUntil) {
      return false;
    }

    // Unblock if block duration has passed
    if (record.blocked && now >= record.blockUntil) {
      record.blocked = false;
      record.count = 0;
      record.resetTime = now + windowMs;
    }

    record.count += 1;

    if (record.count > maxAttempts) {
      record.blocked = true;
      record.blockUntil = now + (blockDurationMs ?? record.resetTime - now);
      return false;
    }

    return true;
  }

  getRemainingTime(key: string): number {
    const record = this.store.get(key);
    if (!record) return 0;
    if (record.blocked) return Math.max(0, record.blockUntil - Date.now());
    return Math.max(0, record.resetTime - Date.now());
  }

  getRemainingAttempts(key: string, maxAttempts: number): number {
    const record = this.store.get(key);
    if (!record) return maxAttempts;
    return Math.max(0, maxAttempts - record.count);
  }

  reset(key: string): void {
    this.store.delete(key);
  }
}

// ─── PRE-CONFIGURED LIMITERS ─────────────────────────────────────────────────

/** Global rate limiter: 150 requests per minute per IP */
export const globalRateLimiter = new RateLimiter();

/** Auth rate limiter: 5 login attempts per 15 minutes per IP, blocked for 15 min */
export const authRateLimiter = new RateLimiter();

/** API rate limiter: 60 requests per minute for protected API routes */
export const apiRateLimiter = new RateLimiter();

/**
 * Checks the GLOBAL rate limit for a given IP.
 * Returns true if allowed, false if blocked.
 */
export function checkGlobalRateLimit(ip: string): boolean {
  return globalRateLimiter.isAllowed(ip, 150, 60 * 1000); // 150 req/min
}

/**
 * Checks the AUTH rate limit for a given IP.
 * Max 5 auth attempts per 15 minutes.
 * Returns { allowed, retryAfterMs }
 */
export function checkAuthRateLimit(ip: string): { allowed: boolean; retryAfterMs: number } {
  const allowed = authRateLimiter.isAllowed(
    ip,
    5,           // max 5 attempts
    15 * 60 * 1000, // 15 min window
    15 * 60 * 1000  // block for 15 min
  );
  return {
    allowed,
    retryAfterMs: allowed ? 0 : authRateLimiter.getRemainingTime(ip),
  };
}

/**
 * Resets the auth rate limit for an IP (call after successful login).
 */
export function resetAuthRateLimit(ip: string): void {
  authRateLimiter.reset(ip);
}