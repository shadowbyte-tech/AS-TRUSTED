import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, authenticateOwner, setAuthCookies } from '@/lib/auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    logger.info('🔍 Login attempt for:', email);
    
    // 1. Try to authenticate as regular/premium user
    let user = await authenticateUser({ email, password });
    
    // 2. If not found, try as owner
    if (!user) {
      user = await authenticateOwner({ email, password });
    }

    if (!user) {
      logger.warn('❌ Authentication failed for:', email);
      
      // DIAGNOSTIC CODE INJECTION
      // We will check exactly why it failed to give feedback
      let diagnosticMessage = 'Invalid credentials. Please check your email and password.';
      try {
        const { readUsers, getDBStatus } = await import('@/lib/mongodb-database');
        const { getPassword } = await import('@/lib/mongodb-database');
        
        const dbStatus = await getDBStatus();
        const users = await readUsers();
        const foundUser = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (!foundUser) {
           diagnosticMessage = `Error: User '${email}' not found. DB connected: ${dbStatus.connected}. DB Error: ${dbStatus.error || 'None'}`;
        } else {
           const storedPwd = await getPassword(foundUser.email);
           if (!storedPwd) {
             diagnosticMessage = `Error: User found but no password record exists in the database.`;
           } else {
             diagnosticMessage = `Error: User found, but password submitted (length: ${password.length}) does not match stored password or hash.`;
           }
        }
      } catch (e) {
          diagnosticMessage = `Error during diagnostic: ${e instanceof Error ? e.message : 'Unknown'}`;
      }

      return NextResponse.json({
        success: false,
        error: diagnosticMessage
      }, { status: 401 });
    }

    logger.info(`✅ Authentication successful for: ${email} (${user.role})`);

    // 3. Set authentication cookies (JWT)
    await setAuthCookies(user);

    // 4. Return success response
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name || email.split('@')[0]
      }
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    logger.error('❌ Login error:', errorMessage);
    
    return NextResponse.json({
      success: false,
      error: 'An error occurred during login. Please try again later.'
    }, { status: 500 });
  }
}
