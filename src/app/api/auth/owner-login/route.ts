export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, setAuthCookies } from '@/lib/mongodb-auth';
import { sanitizeInput } from '@/lib/security';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('🔑 OWNER LOGIN API CALLED');
    
    const body = await request.json();
    const { email, password } = body;
    
    logger.info('📧 Email:', email);
    logger.debug('🔑 Password provided');

    if (!email || !password) {
      logger.warn('❌ Missing email or password');
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = sanitizeInput(email).toLowerCase();
    const sanitizedPassword = sanitizeInput(password);
    
    logger.info('📧 Sanitized email:', sanitizedEmail);

    // For owner login, we bypass the regular lockout system
    // Owner accounts have special privileges and shouldn't be locked out
    const user = await authenticateUser({ 
      email: sanitizedEmail, 
      password: sanitizedPassword 
    });
    
    logger.info(`👤 Authentication result for: ${sanitizedEmail} - ${user ? 'SUCCESS' : 'FAILURE'}`);
    
    if (!user) {
      logger.warn('❌ Authentication failed for:', sanitizedEmail);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    logger.info('✅ Authentication successful for:', user.email);

    // Set secure HTTP-only cookies
    const response = NextResponse.json({
      success: true,
      message: 'Owner login successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
    await setAuthCookies(response, user);
    logger.info('🍪 Auth cookies set');

    return response;

  } catch (error) {
    logger.error('💥 Owner login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
