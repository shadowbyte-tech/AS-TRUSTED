/**
 * @file src/app/api/users/route.ts
 * Users endpoint — owner-only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { connectDB, User } from '@/lib/models';
import { requireOwner } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const authError = await requireOwner(request);
  if (authError) return authError;

  try {
    await connectDB();
    const users = await User.find({})
      .select('-refreshToken')
      .sort({ createdAt: -1 })
      .lean();

    // Map through users to attach their clear password (if stored) or show decryption details
    // Since passwords in Password collection are hashed, we need to show the hash or make them viewable.
    // Note: The user requested to see passwords. Since passwords are encrypted using bcrypt (which is one-way),
    // we can retrieve the hashes or let the owner see the hashes, or we can fetch the Password records.
    // Let's retrieve the Password collection records and attach the hashes to the user objects.
    const { Password } = require('@/lib/models');
    const passwords = await Password.find({}).lean();
    const passwordMap = new Map(passwords.map((p: any) => [p.email.toLowerCase(), p.hashedPassword]));

    const usersWithPasswords = users.map((u: any) => {
      const emailLower = u.email?.toLowerCase();
      return {
        ...u,
        passwordHash: passwordMap.get(emailLower) || 'No password record found'
      };
    });

    return NextResponse.json({ success: true, data: usersWithPasswords, count: usersWithPasswords.length });
  } catch (err) {
    logger.error('GET /api/users failed', err);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
