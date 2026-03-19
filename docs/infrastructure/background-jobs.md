# Background Job Queue System
# BULLMQ + UPSTASH REDIS (FREE)

## Installation
```bash
npm install bullmq @upstash/redis ioredis
```

## Queue Configuration
# src/shared/utils/queue.ts
```typescript
import { Queue, Worker, QueueEvents } from 'bullmq';
import { Redis } from '@upstash/redis';

// Redis connection for BullMQ
const connection = {
  host: process.env.UPSTASH_REDIS_HOST,
  port: process.env.UPSTASH_REDIS_PORT,
  password: process.env.UPSTASH_REDIS_PASSWORD,
  tls: process.env.UPSTASH_REDIS_TLS === 'true',
};

// Queue definitions
export const emailQueue = new Queue('email-queue', { connection });
export const imageProcessingQueue = new Queue('image-processing', { connection });
export const analyticsQueue = new Queue('analytics', { connection });
export const notificationQueue = new Queue('notifications', { connection });

// Queue events for monitoring
export const queueEvents = new QueueEvents('email-queue', { connection });

queueEvents.on('completed', ({ jobId, returnvalue }) => {
  console.log(`✅ Job ${jobId} completed:`, returnvalue);
});

queueEvents.on('failed', ({ jobId, failedReason }) => {
  console.error(`❌ Job ${jobId} failed:`, failedReason);
});

// Job types
export interface EmailJob {
  type: 'welcome' | 'property-inquiry' | 'password-reset' | 'property-uploaded';
  to: string;
  subject?: string;
  template: string;
  data: Record<string, any>;
}

export interface ImageProcessingJob {
  type: 'resize' | 'optimize' | 'thumbnail';
  imageUrl: string;
  propertyId: string;
  options: {
    width?: number;
    height?: number;
    quality?: number;
  };
}

export interface AnalyticsJob {
  type: 'property-view' | 'search' | 'user-action';
  userId?: string;
  propertyId?: string;
  data: Record<string, any>;
  timestamp: number;
}

export interface NotificationJob {
  type: 'new-property' | 'price-change' | 'property-sold';
  userIds: string[];
  title: string;
  message: string;
  data: Record<string, any>;
}
```

## Email Worker
# src/workers/email.worker.ts
```typescript
import { Worker } from 'bullmq';
import { emailQueue, type EmailJob } from '@/shared/utils/queue';
import { sendEmail } from '@/shared/utils/email';
import { logEvent } from '@/shared/utils/logger';

const emailWorker = new Worker<EmailJob>(
  'email-queue',
  async (job) => {
    const { type, to, subject, template, data } = job.data;
    
    try {
      console.log(`📧 Processing email job: ${type} for ${to}`);
      
      let emailSubject = subject;
      let emailHtml = '';
      
      // Generate email content based on template
      switch (template) {
        case 'welcome':
          emailSubject = 'Welcome to AS Trusted Consultancy';
          emailHtml = generateWelcomeEmail(data);
          break;
          
        case 'property-inquiry':
          emailSubject = `Property Inquiry: ${data.propertyTitle}`;
          emailHtml = generatePropertyInquiryEmail(data);
          break;
          
        case 'password-reset':
          emailSubject = 'Password Reset Request';
          emailHtml = generatePasswordResetEmail(data);
          break;
          
        case 'property-uploaded':
          emailSubject = 'Property Successfully Uploaded';
          emailHtml = generatePropertyUploadedEmail(data);
          break;
          
        default:
          throw new Error(`Unknown email template: ${template}`);
      }
      
      // Send email
      const result = await sendEmail({
        to,
        subject: emailSubject,
        html: emailHtml,
      });
      
      // Log success
      await logEvent('email_sent', {
        type,
        to,
        jobId: job.id,
        messageId: result.messageId,
      });
      
      console.log(`✅ Email sent successfully: ${job.id}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Email job failed: ${job.id}`, error);
      
      // Log failure
      await logEvent('email_failed', {
        type,
        to,
        jobId: job.id,
        error: error.message,
      });
      
      throw error;
    }
  },
  { connection, concurrency: 5 }
);

// Email template generators
function generateWelcomeEmail(data: { name: string; email: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Welcome to AS Trusted Consultancy</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .footer { text-align: center; padding: 20px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to AS Trusted Consultancy</h1>
        </div>
        <div class="content">
          <p>Dear ${data.name},</p>
          <p>Thank you for registering with AS Trusted Consultancy! Your account has been successfully created.</p>
          <p>You can now:</p>
          <ul>
            <li>Browse our extensive property listings</li>
            <li>Save your favorite properties</li>
            <li>Submit property inquiries</li>
            <li>Get personalized recommendations</li>
          </ul>
          <p>If you have any questions, feel free to contact us.</p>
        </div>
        <div class="footer">
          <p>Best regards,<br>AS Trusted Consultancy Team</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePropertyInquiryEmail(data: {
  userName: string;
  propertyTitle: string;
  message: string;
  contactInfo: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Property Inquiry</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3b82f6; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .message { background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Property Inquiry</h1>
        </div>
        <div class="content">
          <p><strong>From:</strong> ${data.userName}</p>
          <p><strong>Property:</strong> ${data.propertyTitle}</p>
          <div class="message">
            <p><strong>Message:</strong></p>
            <p>${data.message}</p>
          </div>
          <p><strong>Contact Information:</strong> ${data.contactInfo}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePasswordResetEmail(data: { name: string; resetLink: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Password Reset</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hi ${data.name},</p>
          <p>You requested a password reset for your AS Trusted Consultancy account.</p>
          <p>Click the button below to reset your password:</p>
          <p style="text-align: center;">
            <a href="${data.resetLink}" class="button">Reset Password</a>
          </p>
          <p><strong>Note:</strong> This link will expire in 1 hour.</p>
          <p>If you didn't request this, please ignore this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function generatePropertyUploadedEmail(data: { propertyName: string; propertyId: string }): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Property Uploaded Successfully</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #10b981; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f9fafb; }
        .button { background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Property Uploaded Successfully!</h1>
        </div>
        <div class="content">
          <p>Congratulations! Your property has been successfully uploaded to AS Trusted Consultancy.</p>
          <p><strong>Property Details:</strong></p>
          <ul>
            <li>Name: ${data.propertyName}</li>
            <li>ID: ${data.propertyId}</li>
          </ul>
          <p>You can view your property listing by clicking the button below:</p>
          <p style="text-align: center;">
            <a href="https://astrustedconsultancy.com/properties/${data.propertyId}" class="button">View Property</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export default emailWorker;
```

## Image Processing Worker
# src/workers/image-processing.worker.ts
```typescript
import { Worker } from 'bullmq';
import { imageProcessingQueue, type ImageProcessingJob } from '@/shared/utils/queue';
import { processImage } from '@/shared/utils/image-processor';
import { logEvent } from '@/shared/utils/logger';

const imageWorker = new Worker<ImageProcessingJob>(
  'image-processing',
  async (job) => {
    const { type, imageUrl, propertyId, options } = job.data;
    
    try {
      console.log(`🖼️ Processing image job: ${type} for property ${propertyId}`);
      
      let result;
      
      switch (type) {
        case 'resize':
          result = await processImage.resize(imageUrl, options);
          break;
          
        case 'optimize':
          result = await processImage.optimize(imageUrl, options);
          break;
          
        case 'thumbnail':
          result = await processImage.createThumbnail(imageUrl, options);
          break;
          
        default:
          throw new Error(`Unknown image processing type: ${type}`);
      }
      
      // Update property with processed image
      await updatePropertyImages(propertyId, result);
      
      // Log success
      await logEvent('image_processed', {
        type,
        propertyId,
        jobId: job.id,
        result,
      });
      
      console.log(`✅ Image processed successfully: ${job.id}`);
      return result;
      
    } catch (error) {
      console.error(`❌ Image processing job failed: ${job.id}`, error);
      
      // Log failure
      await logEvent('image_processing_failed', {
        type,
        propertyId,
        jobId: job.id,
        error: error.message,
      });
      
      throw error;
    }
  },
  { connection, concurrency: 3 }
);

async function updatePropertyImages(propertyId: string, processedImages: any) {
  // Implementation to update property with processed images
  console.log(`📝 Updating property ${propertyId} with processed images`);
}

export default imageWorker;
```

## Analytics Worker
# src/workers/analytics.worker.ts
```typescript
import { Worker } from 'bullmq';
import { analyticsQueue, type AnalyticsJob } from '@/shared/utils/queue';
import { AnalyticsService } from '@/shared/utils/analytics';

const analyticsWorker = new Worker<AnalyticsJob>(
  'analytics',
  async (job) => {
    const { type, userId, propertyId, data, timestamp } = job.data;
    
    try {
      console.log(`📊 Processing analytics job: ${type}`);
      
      switch (type) {
        case 'property-view':
          await AnalyticsService.trackPropertyView(propertyId, userId, data);
          break;
          
        case 'search':
          await AnalyticsService.trackSearch(userId, data);
          break;
          
        case 'user-action':
          await AnalyticsService.trackUserAction(userId, data);
          break;
          
        default:
          throw new Error(`Unknown analytics type: ${type}`);
      }
      
      console.log(`✅ Analytics processed successfully: ${job.id}`);
      return { success: true };
      
    } catch (error) {
      console.error(`❌ Analytics job failed: ${job.id}`, error);
      throw error;
    }
  },
  { connection, concurrency: 10 }
);

export default analyticsWorker;
```

## Job Queue API
# src/shared/utils/job-queue.ts
```typescript
import { emailQueue, imageProcessingQueue, analyticsQueue, notificationQueue } from './queue';
import type { EmailJob, ImageProcessingJob, AnalyticsJob, NotificationJob } from './queue';

export class JobQueueService {
  // Email jobs
  static async sendWelcomeEmail(to: string, name: string): Promise<void> {
    await emailQueue.add('welcome-email', {
      type: 'welcome',
      to,
      template: 'welcome',
      data: { name, email: to }
    }, { 
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      }
    });
  }
  
  static async sendPropertyInquiryEmail(
    to: string,
    propertyTitle: string,
    userName: string,
    message: string,
    contactInfo: string
  ): Promise<void> {
    await emailQueue.add('property-inquiry', {
      type: 'property-inquiry',
      to,
      template: 'property-inquiry',
      data: { propertyTitle, userName, message, contactInfo }
    }, { attempts: 3 });
  }
  
  static async sendPasswordResetEmail(to: string, name: string, resetLink: string): Promise<void> {
    await emailQueue.add('password-reset', {
      type: 'password-reset',
      to,
      template: 'password-reset',
      data: { name, resetLink }
    }, { 
      attempts: 3,
      delay: 1000 // 1 second delay
    });
  }
  
  static async sendPropertyUploadedEmail(to: string, propertyName: string, propertyId: string): Promise<void> {
    await emailQueue.add('property-uploaded', {
      type: 'property-uploaded',
      to,
      template: 'property-uploaded',
      data: { propertyName, propertyId }
    }, { attempts: 3 });
  }
  
  // Image processing jobs
  static async processImageResize(
    imageUrl: string,
    propertyId: string,
    width: number,
    height: number
  ): Promise<void> {
    await imageProcessingQueue.add('resize-image', {
      type: 'resize',
      imageUrl,
      propertyId,
      options: { width, height }
    }, { 
      attempts: 2,
      priority: 5
    });
  }
  
  static async processImageThumbnail(
    imageUrl: string,
    propertyId: string,
    width: number = 200,
    height: number = 200
  ): Promise<void> {
    await imageProcessingQueue.add('create-thumbnail', {
      type: 'thumbnail',
      imageUrl,
      propertyId,
      options: { width, height }
    }, { 
      attempts: 2,
      priority: 10 // Higher priority for thumbnails
    });
  }
  
  // Analytics jobs
  static async trackPropertyView(
    propertyId: string,
    userId?: string,
    data: Record<string, any> = {}
  ): Promise<void> {
    await analyticsQueue.add('property-view', {
      type: 'property-view',
      propertyId,
      userId,
      data,
      timestamp: Date.now()
    }, { 
      attempts: 1,
      priority: 1 // Low priority for analytics
    });
  }
  
  static async trackSearch(
    userId: string | undefined,
    query: string,
    filters: Record<string, any>
  ): Promise<void> {
    await analyticsQueue.add('search', {
      type: 'search',
      userId,
      data: { query, filters },
      timestamp: Date.now()
    }, { attempts: 1, priority: 1 });
  }
  
  static async trackUserAction(
    userId: string,
    action: string,
    data: Record<string, any> = {}
  ): Promise<void> {
    await analyticsQueue.add('user-action', {
      type: 'user-action',
      userId,
      data: { action, ...data },
      timestamp: Date.now()
    }, { attempts: 1, priority: 1 });
  }
  
  // Notification jobs
  static async sendNotification(
    userIds: string[],
    title: string,
    message: string,
    data: Record<string, any> = {}
  ): Promise<void> {
    await notificationQueue.add('send-notification', {
      type: 'new-property',
      userIds,
      title,
      message,
      data
    }, { attempts: 3 });
  }
}
```

## Worker Startup Script
# scripts/start-workers.ts
```typescript
import emailWorker from '../src/workers/email.worker';
import imageWorker from '../src/workers/image-processing.worker';
import analyticsWorker from '../src/workers/analytics.worker';

console.log('🚀 Starting background workers...');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down workers...');
  emailWorker.close();
  imageWorker.close();
  analyticsWorker.close();
  process.exit(0);
});

console.log('✅ All workers started successfully');
```

## Package.json Scripts
```json
{
  "scripts": {
    "workers:start": "tsx scripts/start-workers.ts",
    "workers:dev": "tsx watch scripts/start-workers.ts",
    "queue:test": "tsx scripts/test-queue.ts"
  }
}
```

## Usage in API Routes
# src/services/property-service/routes/properties.ts
```typescript
import { NextRequest } from 'next/server';
import { JobQueueService } from '@/shared/utils/job-queue';
import { PropertyController } from '../controllers/property.controller';

export async function POST(request: NextRequest) {
  const response = await PropertyController.createProperty(request);
  
  // Queue background jobs on successful property creation
  if (response.status === 201) {
    const propertyData = await response.json();
    
    // Send confirmation email
    await JobQueueService.sendPropertyUploadedEmail(
      request.user.email,
      propertyData.propertyName,
      propertyData.id
    );
    
    // Process property images
    if (propertyData.images && propertyData.images.length > 0) {
      for (const imageUrl of propertyData.images) {
        await JobQueueService.processImageThumbnail(imageUrl, propertyData.id);
        await JobQueueService.processImageResize(imageUrl, propertyData.id, 800, 600);
      }
    }
    
    // Track analytics
    await JobQueueService.trackUserAction(
      request.user.id,
      'property_created',
      { propertyId: propertyData.id }
    );
  }
  
  return response;
}
```
