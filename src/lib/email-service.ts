import { Resend } from 'resend';
import { logger } from './logger';

let resendInstance: Resend | null = null;

function getResend() {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey || apiKey === 're_123') {
      logger.warn('⚠️ RESEND_API_KEY is missing or invalid. Email services will be disabled.');
      return null;
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export async function sendEmail({ to, subject, html, from = 'noreply@astrustedconsultancy.com' }: EmailOptions) {
  try {
    const resend = getResend();
    if (!resend) {
      return { success: false, error: 'Email service not configured (missing API key)' };
    }

    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      logger.error('Email send error:', error);
      return { success: false, error: error.message };
    }

    logger.info('Email sent successfully:', data);
    return { success: true, data };
  } catch (error) {
    logger.error('Email service error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

// Feedback email template
export function createFeedbackEmail(feedback: string, type: string, userEmail?: string, userName?: string) {
  return {
    to: 'swamy@consult.com',
    subject: `New Feedback from AS Trusted Consultancy - ${type}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">📧 New Feedback Received</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">AS Trusted Consultancy - User Feedback</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">👤 User Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${userName || 'Anonymous'}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${userEmail || 'Not provided'}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> <span style="background: #eab308; color: white; padding: 2px 8px; border-radius: 4px; font-size: 12px;">${type}</span></p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">💬 Feedback Message</h3>
            <div style="background: #f1f3f4; padding: 12px; border-radius: 6px; border-left: 4px solid #1e3a8a;">
              <p style="margin: 0; white-space: pre-wrap;">${feedback}</p>
            </div>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
          <p style="margin: 0;">🏢 AS Trusted Consultancy | Real Estate Investment Platform</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">This feedback was submitted via the website feedback form</p>
        </div>
      </div>
    `
  };
}

// Property inquiry email template
export function createPropertyInquiryEmail(property: any, userInfo: { name: string; email: string; phone?: string; message?: string }) {
  return {
    to: 'swamy@consult.com',
    subject: `New Property Inquiry - ${property.propertyType} in ${property.villageName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🏠 New Property Inquiry</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">AS Trusted Consultancy - Property Interest</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">👤 Customer Information</h3>
            <p style="margin: 5px 0;"><strong>Name:</strong> ${userInfo.name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${userInfo.email}</p>
            ${userInfo.phone ? `<p style="margin: 5px 0;"><strong>Phone:</strong> ${userInfo.phone}</p>` : ''}
            <p style="margin: 5px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">🏡 Property Details</h3>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${property.propertyType}</p>
            <p style="margin: 5px 0;"><strong>ID:</strong> ${property.propertyNumber}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${property.villageName}, ${property.areaName}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> ₹${property.price?.toLocaleString('en-IN')}</p>
            <p style="margin: 5px 0;"><strong>Status:</strong> ${property.status}</p>
          </div>
          
          ${userInfo.message ? `
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">💬 Customer Message</h3>
            <div style="background: #f1f3f4; padding: 12px; border-radius: 6px; border-left: 4px solid #1e3a8a;">
              <p style="margin: 0; white-space: pre-wrap;">${userInfo.message}</p>
            </div>
          </div>
          ` : ''}
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
          <p style="margin: 0;">🏢 AS Trusted Consultancy | Real Estate Investment Platform</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">Please contact the customer as soon as possible</p>
        </div>
      </div>
    `
  };
}

// Welcome email for new registrations
export function createWelcomeEmail(userInfo: { name: string; email: string }) {
  return {
    to: userInfo.email,
    subject: 'Welcome to AS Trusted Consultancy!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); color: white; padding: 20px; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 24px;">🎉 Welcome to AS Trusted Consultancy!</h1>
          <p style="margin: 5px 0 0 0; opacity: 0.9;">Your Gateway to Premium Real Estate Investments</p>
        </div>
        
        <div style="background: #f8f9fa; padding: 20px; border: 1px solid #e9ecef;">
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
            <h2 style="margin: 0 0 15px 0; color: #1e3a8a;">Hello ${userInfo.name},</h2>
            <p style="margin: 0 0 15px 0; line-height: 1.6;">
              Thank you for registering with AS Trusted Consultancy! We're excited to help you find your perfect property investment opportunity.
            </p>
            
            <h3 style="margin: 20px 0 10px 0; color: #1e3a8a;">What's Next?</h3>
            <ul style="margin: 0 0 15px 20px; line-height: 1.6;">
              <li>Browse our extensive collection of plots, houses, and land</li>
              <li>Use our advanced filters to find properties matching your criteria</li>
              <li>Save your favorite properties to your wishlist</li>
              <li>Compare multiple properties side by side</li>
              <li>Contact us directly for personalized assistance</li>
            </ul>
            
            <div style="text-align: center; margin: 20px 0;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/properties" 
                 style="background: #1e3a8a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Browse Properties
              </a>
            </div>
          </div>
          
          <div style="background: white; padding: 15px; border-radius: 8px;">
            <h3 style="margin: 0 0 10px 0; color: #1e3a8a;">📞 Need Help?</h3>
            <p style="margin: 0; line-height: 1.6;">
              Our team is here to help you find the perfect investment opportunity. 
              Feel free to reach out to us at any time:
            </p>
            <ul style="margin: 10px 0 0 20px; line-height: 1.6;">
              <li><strong>Phone:</strong> +91 98664 04090</li>
              <li><strong>Email:</strong> swamy@consult.com</li>
              <li><strong>WhatsApp:</strong> <a href="https://wa.me/919866404090">Click to WhatsApp</a></li>
            </ul>
          </div>
        </div>
        
        <div style="background: #1e3a8a; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px;">
          <p style="margin: 0;">🏢 AS Trusted Consultancy | Real Estate Investment Platform</p>
          <p style="margin: 5px 0 0 0; opacity: 0.8;">Your Trusted Partner in Real Estate</p>
        </div>
      </div>
    `
  };
}
