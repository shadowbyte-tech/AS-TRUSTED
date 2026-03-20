export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setAuthCookies } from '@/lib/mongodb-auth';
import { trackLoginAttempt, isAccountLocked, getRemainingLockoutTime } from '@/lib/enhanced-auth';
import { handleError } from '@/lib/errors';
import { API_MESSAGES } from '@/lib/constants';
import { logger } from '@/lib/logger';
import { createAuditTrail } from '@/lib/audit';
import { sanitizeInput, validateEmail, globalRateLimiter } from '@/lib/security';

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 
                      request.headers.get('x-real-ip') || 
                      'unknown';
    
    // DEBUG: Log request details
    console.log('🔍 Login API Debug:', {
      clientIP,
      userAgent: request.headers.get('user-agent'),
      contentType: request.headers.get('content-type'),
      hasBody: !!request.body,
      env: process.env.NODE_ENV,
      jwtSecret: !!process.env.JWT_SECRET
    });
    
    // Rate limiting: 5 attempts per 15 minutes per IP (disabled in production for debugging)
    if (process.env.NODE_ENV === 'development' && !globalRateLimiter.isAllowed(`login:${clientIP}`, 5, 15 * 60 * 1000)) {
      const remainingTime = globalRateLimiter.getRemainingTime(`login:${clientIP}`);
      logger.warn('Auth: Rate limit exceeded', { ip: clientIP });
      
      await createAuditTrail({
        action: 'LOGIN_RATE_LIMIT',
        category: 'SECURITY',
        details: { ip: clientIP, remainingTime },
        status: 'FAILURE'
      });

      return NextResponse.json(
        { 
          error: 'Too many login attempts. Please try again later.',
          retryAfter: Math.ceil(remainingTime / 1000)
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { email, password } = body;
    
    logger.info('📧 Login request for email:', email);
    logger.debug('🔑 Password provided');

    if (!email || !password) {
      logger.warn('❌ Missing email or password');
      return NextResponse.json(
        { error: API_MESSAGES.ERROR.MISSING_FIELDS, fields: ['email', 'password'] },
        { status: 400 }
      );
    }

    // Sanitize and validate email
    const sanitizedEmail = sanitizeInput(email);
    const emailValidation = validateEmail(sanitizedEmail);
    if (!emailValidation.valid) {
      logger.warn('❌ Email validation failed:', emailValidation.error);
      return NextResponse.json(
        { error: emailValidation.error },
        { status: 400 }
      );
    }

    // Check account lockout
    if (isAccountLocked(sanitizedEmail)) {
      const remainingTime = getRemainingLockoutTime(sanitizedEmail);
      logger.warn('Auth: Account locked', { email: sanitizedEmail });
      
      await createAuditTrail({
        action: 'LOGIN_LOCKED',
        category: 'SECURITY',
        details: { email: sanitizedEmail },
        status: 'FAILURE',
        request
      });

      return NextResponse.json(
        { 
          error: 'Account temporarily locked due to multiple failed login attempts',
          retryAfter: Math.ceil(remainingTime / 1000)
        },
        { status: 429 }
      );
    }

    // Sanitize password (but don't validate strength for login)
    const sanitizedPassword = sanitizeInput(password);
    
    logger.info('🔍 Attempting authentication for:', sanitizedEmail);
    const user = await authenticateUser({ 
      email: sanitizedEmail, 
      password: sanitizedPassword 
    });
    
    logger.info('👤 Authentication result:', user ? 'SUCCESS' : 'FAILED');
    
    // Track login attempt
    const loginSuccess = user !== null;
    const canProceed = trackLoginAttempt(sanitizedEmail, loginSuccess, clientIP);
    
    if (!user) {
      logger.info('Auth: Invalid credentials', { email: sanitizedEmail });
      
      await createAuditTrail({
        action: 'LOGIN_FAILURE',
        category: 'AUTH',
        details: { email: sanitizedEmail, reason: 'INVALID_CREDENTIALS' },
        status: 'FAILURE',
        request
      });

      if (!canProceed) {
        const remainingTime = getRemainingLockoutTime(sanitizedEmail);
        return NextResponse.json(
          { 
            error: 'Account locked due to multiple failed login attempts',
            retryAfter: Math.ceil(remainingTime / 1000)
          },
          { status: 429 }
        );
      }
      
      return NextResponse.json(
        { error: API_MESSAGES.ERROR.INVALID_CREDENTIALS },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful login
    globalRateLimiter.reset(`login:${clientIP}`);
    logger.info('Auth: Rate limiter reset', { ip: clientIP });

    // Set secure HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      user,
    });
    await setAuthCookies(response, user);

    // 🕒 AUDIT: Log successful login
    await createAuditTrail({
      action: 'LOGIN_SUCCESS',
      category: 'AUTH',
      userId: user.id,
      userEmail: user.email,
      request
    });

    logger.info('Auth: Login successful', { email: user.email });

    return response;
  } catch (error) {
    logger.error('❌ Login API error:', error);
    const { message, statusCode } = handleError(error);
    return NextResponse.json(
      { error: message },
      { status: statusCode }
    );
  }
}
