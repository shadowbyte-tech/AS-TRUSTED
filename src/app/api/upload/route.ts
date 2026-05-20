/**
 * @file src/app/api/upload/route.ts
 * Image upload to Cloudinary — authenticated owners only.
 */
import { NextRequest, NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import { requirePremium } from '@/lib/api-auth';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(request: NextRequest) {
  const authError = await requirePremium(request);
  if (authError) return authError;

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP' }, { status: 400 });
    }
    if (file.size > MAX_SIZE_BYTES) {
      return NextResponse.json({ error: 'File too large. Maximum size is 10MB' }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    // Fallback if Cloudinary is not configured / set to placeholders
    const isCloudinaryConfigured =
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloud_name' &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_KEY !== 'your_api_key';

    if (!isCloudinaryConfigured) {
      const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
      logger.info(`⚠️ Cloudinary not configured. Falling back to data URI.`);
      return NextResponse.json({
        success: true,
        url: dataUri,
        publicId: `mock_${Date.now()}`,
        width: 800,
        height: 600,
      });
    }

    const result = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'as-trusted-consultancy/properties',
          resource_type: 'image',
          transformation: [
            { width: 1920, height: 1080, crop: 'limit' },
            { quality: 'auto:good', fetch_format: 'auto' },
          ],
        },
        (err, res) => {
          if (err || !res) reject(err || new Error('Upload failed'));
          else resolve(res);
        }
      ).end(buffer);
    });

    logger.info(`✅ Image uploaded to Cloudinary: ${result.public_id}`);

    return NextResponse.json({
      success: true,
      url:       result.secure_url,
      publicId:  result.public_id,
      width:     result.width,
      height:    result.height,
    });
  } catch (err) {
    logger.error('Upload to Cloudinary failed, attempting data URI fallback', err);
    try {
      const formData = await request.formData();
      const file = formData.get('file') as File;
      const buffer = Buffer.from(await file.arrayBuffer());
      const dataUri = `data:${file.type};base64,${buffer.toString('base64')}`;
      return NextResponse.json({
        success: true,
        url: dataUri,
        publicId: `fallback_${Date.now()}`,
        width: 800,
        height: 600,
      });
    } catch (fallbackErr) {
      logger.error('Data URI fallback failed too', fallbackErr);
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }
  }
}
