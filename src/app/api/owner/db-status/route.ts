import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectDB, Property, User, Inquiry, Lead, Contact } from '@/lib/models';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await connectDB();

    const [users, properties, inquiries, leads, contacts] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Inquiry.countDocuments(),
      Lead.countDocuments(),
      Contact.countDocuments(),
    ]);

    return NextResponse.json({
      success: true,
      status: 'healthy',
      database: 'MongoDB Atlas',
      mongooseState: mongoose.connection.readyState,
      stats: {
        users,
        properties,
        inquiries,
        leads,
        contacts,
        collections: ['users', 'passwords', 'properties', 'inquiries', 'leads', 'contacts', 'favorites', 'comparisons', 'auditlogs', 'sitevisits'],
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('DB Status Error:', error);
    return NextResponse.json(
      { success: false, status: 'error', database: 'MongoDB Atlas', error: String(error) },
      { status: 500 }
    );
  }
}
