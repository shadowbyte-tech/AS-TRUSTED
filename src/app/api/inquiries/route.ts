import { NextRequest, NextResponse } from 'next/server';
import { readInquiries, createInquiry } from '@/lib/mongodb-database';
import { InquirySchema } from '@/lib/validation';
import { globalRateLimiter, sanitizeInput } from '@/lib/security';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const inquiries = await readInquiries();
    return NextResponse.json(inquiries);
  } catch (error) {
    logger.error('Error fetching inquiries:', error);
    return NextResponse.json({ error: 'Failed to fetch inquiries' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
    
    // Rate limit: 3 inquiries per 15 minutes per IP
    if (!globalRateLimiter.isAllowed(`inquiry:${clientIP}`, 3, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Too many inquiry attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    
    // Validate input
    const validatedData = InquirySchema.safeParse(body);
    if (!validatedData.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validatedData.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    // Sanitize message content
    const sanitizedData = {
      ...validatedData.data,
      message: sanitizeInput(validatedData.data.message),
      name: sanitizeInput(validatedData.data.name),
    };

    const newInquiry = await createInquiry({
      ...sanitizedData,
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, inquiryId: newInquiry.id }, { status: 201 });
  } catch (error) {
    logger.error('Error creating inquiry:', error);
    return NextResponse.json({ error: 'Failed to create inquiry' }, { status: 500 });
  }
}
