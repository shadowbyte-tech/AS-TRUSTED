/**
 * @file src/app/api/db-status/route.ts
 * Health check — tests MongoDB connection.
 */
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();
    return NextResponse.json({ status: 'ok', database: 'MongoDB Atlas', connected: true });
  } catch (err: any) {
    return NextResponse.json(
      { status: 'error', database: 'MongoDB Atlas', connected: false, error: err?.message },
      { status: 503 }
    );
  }
}
