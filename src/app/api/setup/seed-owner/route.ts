/**
 * /api/setup/seed-owner
 * ONE-TIME route to create the initial owner account.
 * Protected by SETUP_SECRET env var. Delete this route after first use.
 */
import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB, User, Password } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Must match SETUP_SECRET env var — prevents unauthorized use
  const secret = request.headers.get('x-setup-secret');
  const expectedSecret = process.env.SETUP_SECRET;

  if (!expectedSecret) {
    return NextResponse.json({ error: 'SETUP_SECRET not configured. Add it to Vercel env vars.' }, { status: 500 });
  }
  if (!secret || secret !== expectedSecret) {
    return NextResponse.json({ error: 'Invalid setup secret' }, { status: 401 });
  }

  try {
    await connectDB();

    const email = 'owner@astrustedconsultancy.com';

    const existing = await User.findOne({ email }).lean();
    if (existing) {
      return NextResponse.json({
        success: true,
        message: 'Owner already exists — nothing to do.',
        email,
      });
    }

    const password = process.env.OWNER_PASSWORD || 'ASTrusted@Admin2024!';
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
      message: '✅ Owner account created successfully!',
      email,
      note: 'IMPORTANT: Remove SETUP_SECRET from Vercel env vars now, or delete this route.',
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
