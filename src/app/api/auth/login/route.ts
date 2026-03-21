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

    logger.info(`🔍 Login attempt for: ${email}`);
    
    // 1. Try to authenticate as regular/premium user
    let user = await authenticateUser({ email, password });
    
    // 2. If not found, try as owner
    if (!user) {
      logger.debug(`🔍 User "${email}" not found as regular user, trying as Owner`);
      user = await authenticateOwner({ email, password });
    }

    if (!user) {
      logger.warn(`❌ Authentication failed for: ${email}. Check credentials/role.`);
      return NextResponse.json({
        success: false,
        error: 'Invalid credentials. Please check your email and password.'
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

    } catch (error: any) {
    const errorString = JSON.stringify(error, Object.getOwnPropertyNames(error));
    logger.error('❌ Login error (detailed):', errorString);
    
    const supabaseUrlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKeySet = !!process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;
    const jwtSecretSet = !!process.env.JWT_SECRET;

    return NextResponse.json({
      success: false,
      error: `Login failed. Diagnostics:
- Supabase URL Set: ${supabaseUrlSet}
- Supabase Key Set: ${supabaseKeySet}
- JWT Secret Set: ${jwtSecretSet}
- Error Detail: ${error?.message || 'Unknown error'}
- Full Info: ${errorString.substring(0, 200)}`
    }, { status: 500 });
  }
}
