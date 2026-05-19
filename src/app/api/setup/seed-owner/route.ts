/**
 * /api/setup/seed-owner — ONE-TIME owner account creator.
 * DELETE THIS ROUTE after the owner account is created.
 */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';

export const dynamic = 'force-dynamic';

// Hardcoded token — no env var dependency
const SEED_TOKEN = 'ast-init-7x9k2m';

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get('token');

  if (token !== SEED_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const email    = 'owner@astrustedconsultancy.com';
    const password = 'ASTrusted@Admin2024!';

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Owner already exists.',
        email,
        loginWith: password,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await User.create({
      email,
      role: 'Owner',
      name: 'AS Trusted Admin',
      isActive: true,
      isBlocked: false,
    });
    await Password.create({ email, hashedPassword });

    return NextResponse.json({
      success: true,
      message: '✅ Owner account created!',
      email,
      password,
      note: 'Delete this route from your codebase now.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
