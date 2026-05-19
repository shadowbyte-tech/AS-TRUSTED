/**
 * @file src/lib/cloudinary.ts
 * Cloudinary image upload utility.
 */
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure:     true,
});

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
const MAX_SIZE      = 10 * 1024 * 1024; // 10MB

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type. Allowed: JPEG, PNG, WebP');
  }
  if (file.size > MAX_SIZE) {
    throw new Error('File too large. Maximum size is 10MB');
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise<string>((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'as-trusted-consultancy/properties',
        resource_type: 'image',
        transformation: [
          { width: 1920, height: 1080, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' },
        ],
      },
      (err, result) => {
        if (err || !result) reject(err || new Error('Cloudinary upload failed'));
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

export default cloudinary;
