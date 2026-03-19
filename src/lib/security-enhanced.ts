import { NextRequest, NextResponse } from 'next/server';

// Rate limiting storage (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Maximum requests per window
  message?: string; // Custom error message
}

// Rate limiting middleware
export function createRateLimit(config: RateLimitConfig) {
  return async (request: NextRequest, identifier?: string): Promise<{ success: boolean; error?: string }> => {
    const key = identifier || getClientIdentifier(request);
    const now = Date.now();
    const windowStart = now - config.windowMs;

    // Clean up expired entries
    for (const [k, v] of rateLimitStore.entries()) {
      if (v.resetTime < now) {
        rateLimitStore.delete(k);
      }
    }

    const record = rateLimitStore.get(key);

    if (!record) {
      // First request from this identifier
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { success: true };
    }

    if (now > record.resetTime) {
      // Window has reset
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + config.windowMs
      });
      return { success: true };
    }

    if (record.count >= config.maxRequests) {
      // Rate limit exceeded
      return {
        success: false,
        error: config.message || `Too many requests. Please try again later.`
      };
    }

    // Increment counter
    record.count++;
    return { success: true };
  };
}

// Get client identifier for rate limiting
function getClientIdentifier(request: NextRequest): string {
  // Try to get IP address from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  const ip = forwardedFor?.split(',')[0] || realIp || cfConnectingIp || 'unknown';
  
  // Add user agent for additional uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  return `${ip}-${userAgent}`;
}

// Input validation utilities
export class InputValidator {
  // Email validation
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Phone number validation (Indian format)
  static isValidPhone(phone: string): boolean {
    const phoneRegex = /^[+]?[91]?[6-9]\d{9}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  // Name validation
  static isValidName(name: string): boolean {
    return name.length >= 2 && name.length <= 100 && /^[a-zA-Z\s]+$/.test(name);
  }

  // Property number validation
  static isValidPropertyNumber(propertyNumber: string): boolean {
    return propertyNumber.length >= 3 && propertyNumber.length <= 50;
  }

  // Price validation
  static isValidPrice(price: number): boolean {
    return price > 0 && price <= 100000000; // Max 10 crore
  }

  // Description validation
  static isValidDescription(description: string): boolean {
    return description.length <= 2000; // Max 2000 characters
  }

  // Village name validation
  static isValidVillageName(villageName: string): boolean {
    return villageName.length >= 2 && villageName.length <= 100;
  }

  // Area name validation
  static isValidAreaName(areaName: string): boolean {
    return areaName.length >= 2 && areaName.length <= 200;
  }

  // Sanitize input
  static sanitize(input: string): string {
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential HTML tags
      .replace(/javascript:/gi, '') // Remove javascript protocol
      .replace(/on\w+=/gi, ''); // Remove event handlers
  }

  // Validate property data
  static validatePropertyData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidPropertyNumber(data.propertyNumber)) {
      errors.push('Invalid property number');
    }

    if (!this.isValidVillageName(data.villageName)) {
      errors.push('Invalid village name');
    }

    if (!this.isValidAreaName(data.areaName)) {
      errors.push('Invalid area name');
    }

    if (!this.isValidPrice(data.price)) {
      errors.push('Invalid price');
    }

    if (data.description && !this.isValidDescription(data.description)) {
      errors.push('Description too long');
    }

    // Type-specific validation
    if (data.propertyType === 'Plot') {
      if (!data.plotSize || data.plotSize.length < 1) {
        errors.push('Plot size is required');
      }
    } else if (data.propertyType === 'House') {
      if (!data.houseSize || data.houseSize.length < 1) {
        errors.push('House size is required');
      }
      if (!data.bedrooms || data.bedrooms < 1 || data.bedrooms > 20) {
        errors.push('Invalid number of bedrooms');
      }
      if (!data.bathrooms || data.bathrooms < 1 || data.bathrooms > 20) {
        errors.push('Invalid number of bathrooms');
      }
    } else if (data.propertyType === 'Land') {
      if (!data.landSize || data.landSize.length < 1) {
        errors.push('Land size is required');
      }
      if (!data.zoning || data.zoning.length < 1) {
        errors.push('Zoning information is required');
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Validate contact form data
  static validateContactData(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.isValidName(data.name)) {
      errors.push('Invalid name');
    }

    if (!this.isValidEmail(data.email)) {
      errors.push('Invalid email');
    }

    if (data.phone && !this.isValidPhone(data.phone)) {
      errors.push('Invalid phone number');
    }

    if (data.message && data.message.length > 1000) {
      errors.push('Message too long');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}

// Security headers middleware
export function addSecurityHeaders(response: NextResponse): NextResponse {
  // Prevent clickjacking
  response.headers.set('X-Frame-Options', 'DENY');
  
  // Prevent MIME type sniffing
  response.headers.set('X-Content-Type-Options', 'nosniff');
  
  // XSS Protection
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' https:; connect-src 'self' https:; frame-ancestors 'none';"
  );
  
  // Referrer Policy
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Permissions Policy
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  return response;
}

// CSRF protection
export class CSRFProtection {
  private static tokens = new Map<string, { token: string; expires: number }>();

  // Generate CSRF token
  static generateToken(sessionId: string): string {
    const token = Math.random().toString(36).substring(2, 15) + 
                  Math.random().toString(36).substring(2, 15);
    const expires = Date.now() + (60 * 60 * 1000); // 1 hour
    
    this.tokens.set(sessionId, { token, expires });
    return token;
  }

  // Validate CSRF token
  static validateToken(sessionId: string, token: string): boolean {
    const record = this.tokens.get(sessionId);
    
    if (!record || record.expires < Date.now()) {
      return false;
    }
    
    return record.token === token;
  }

  // Clean up expired tokens
  static cleanup(): void {
    const now = Date.now();
    for (const [key, value] of this.tokens.entries()) {
      if (value.expires < now) {
        this.tokens.delete(key);
      }
    }
  }
}

// SQL injection protection
export function sanitizeSQL(input: string): string {
  // Remove potential SQL injection patterns
  return input
    .replace(/['"\\]/g, '') // Remove quotes and backslashes
    .replace(/--/g, '') // Remove SQL comments
    .replace(/;/g, '') // Remove semicolons
    .replace(/\b(OR|AND|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b/gi, '') // Remove SQL keywords
    .trim();
}

// File upload security
export class FileUploadSecurity {
  // Allowed file types
  private static allowedTypes = [
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'image/webp',
    'application/pdf'
  ];

  // Maximum file size (5MB)
  private static maxSize = 5 * 1024 * 1024;

  // Validate file upload
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Check file type
    if (!this.allowedTypes.includes(file.type)) {
      return { isValid: false, error: 'Invalid file type' };
    }

    // Check file size
    if (file.size > this.maxSize) {
      return { isValid: false, error: 'File too large' };
    }

    // Check file name
    if (file.name.length > 255) {
      return { isValid: false, error: 'File name too long' };
    }

    // Check for suspicious file extensions
    const suspiciousExtensions = ['.php', '.js', '.exe', '.bat', '.sh', '.py'];
    const hasSuspiciousExtension = suspiciousExtensions.some(ext => 
      file.name.toLowerCase().endsWith(ext)
    );

    if (hasSuspiciousExtension) {
      return { isValid: false, error: 'Suspicious file type' };
    }

    return { isValid: true };
  }

  // Sanitize file name
  static sanitizeFileName(fileName: string): string {
    return fileName
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters
      .replace(/_{2,}/g, '_') // Replace multiple underscores
      .toLowerCase();
  }
}

// Rate limit configurations for different endpoints
export const rateLimitConfigs = {
  // General API rate limit
  api: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // 100 requests per 15 minutes
    message: 'Too many API requests. Please try again later.'
  }),

  // Authentication rate limit
  auth: createRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 login attempts per 15 minutes
    message: 'Too many login attempts. Please try again later.'
  }),

  // Contact form rate limit
  contact: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 contact submissions per hour
    message: 'Too many contact submissions. Please try again later.'
  }),

  // Property upload rate limit
  upload: createRateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 20, // 20 uploads per hour
    message: 'Too many uploads. Please try again later.'
  })
};

// Security middleware wrapper
export async function withSecurity(
  handler: (request: NextRequest) => Promise<NextResponse>,
  options: {
    rateLimit?: keyof typeof rateLimitConfigs;
    requireAuth?: boolean;
    validateInput?: boolean;
  } = {}
) {
  return async (request: NextRequest) => {
    try {
      // Rate limiting
      if (options.rateLimit) {
        const rateLimitResult = await rateLimitConfigs[options.rateLimit](request);
        if (!rateLimitResult.success) {
          return NextResponse.json(
            { error: rateLimitResult.error },
            { status: 429 }
          );
        }
      }

      // Input validation
      if (options.validateInput) {
        const body = await request.json().catch(() => null);
        if (body) {
          const validation = InputValidator.validatePropertyData(body);
          if (!validation.isValid) {
            return NextResponse.json(
              { error: 'Invalid input', details: validation.errors },
              { status: 400 }
            );
          }
        }
      }

      // Execute handler
      const response = await handler(request);
      
      // Add security headers
      return addSecurityHeaders(response);
      
    } catch (error) {
      console.error('Security middleware error:', error);
      return NextResponse.json(
        { error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}
