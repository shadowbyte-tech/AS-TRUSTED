import { v2 as cloudinary } from 'cloudinary';
import { validateFile } from './security';
import { VALIDATION } from './constants';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export async function uploadImage(file: File): Promise<string> {
  // Validate file before upload
  const validation = validateFile(file, {
    maxSize: VALIDATION.IMAGE_MAX_SIZE,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.webp']
  });

  if (!validation.valid) {
    throw new Error(validation.error || 'Invalid file');
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        folder: 'as-trusted-consultancy',
        resource_type: 'auto',
        max_file_size: VALIDATION.IMAGE_MAX_SIZE,
        allowed_formats: ['jpg', 'png', 'webp'],
        transformation: [
          { width: 2000, height: 2000, crop: 'limit' },
          { quality: 'auto:good' }
        ]
      },
      (error, result) => {
        if (error || !result) {
          reject(error || new Error('Upload failed'));
          return;
        }
        resolve(result.secure_url);
      }
    ).end(buffer);
  });
}

export async function uploadImageWithAuth(file: File, userRole?: string): Promise<string> {
  // Check user permissions (only Owner/Admin can upload)
  if (userRole !== 'Owner' && userRole !== 'Admin') {
    throw new Error('Unauthorized: Only administrators can upload images');
  }

  return uploadImage(file);
}

export default cloudinary;
