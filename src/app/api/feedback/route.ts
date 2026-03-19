export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, createFeedbackEmail } from '@/lib/email-service';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const { feedback, type, userEmail, userName } = await request.json();
    
    // Create and send the feedback email
    const emailData = createFeedbackEmail(feedback, type, userEmail, userName);
    const result = await sendEmail(emailData);
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Feedback sent successfully to swamy@consult.com',
        emailId: result.data?.id
      });
    } else {
      logger.error('Email sending failed:', result.error);
      return NextResponse.json({ 
        error: 'Failed to send feedback email',
        details: result.error
      }, { status: 500 });
    }

  } catch (error) {
    logger.error('Error processing feedback:', error);
    return NextResponse.json({ 
      error: 'Failed to process feedback',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
