import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { setPassword } from '@/lib/password-storage';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    logger.info('🔧 UPDATE OWNER PASSWORD API CALLED');
    
    const body = await request.json();
    const { email, newPassword } = body;
    
    if (!email || !newPassword) {
      return NextResponse.json(
        { error: 'Email and new password are required' },
        { status: 400 }
      );
    }
    
    logger.info('📧 Email:', email);
    logger.debug('🔑 New password length confirmed');
    
    // Create new hash
    const newHash = await bcrypt.hash(newPassword, 10);
    logger.debug('🔐 New hash created');
    
    // Test the hash
    const testResult = await bcrypt.compare(newPassword, newHash);
    logger.debug('🧪 Hash test result:', testResult);
    
    if (!testResult) {
      logger.error('❌ Hash test failed!');
      return NextResponse.json(
        { error: 'Hash generation failed' },
        { status: 500 }
      );
    }
    
    // Update the password
    await setPassword(email, newHash);
    logger.info('✅ Password updated successfully');
    
    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
      hash: newHash
    });
    
  } catch (error) {
    logger.error('❌ Update password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}