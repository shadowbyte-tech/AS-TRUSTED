/**
 * @file src/lib/env-validation.ts
 * Validates required environment variables.
 * ONLY MongoDB + Cloudinary + JWT. Supabase/Turso removed.
 */
import { logger } from './logger';

interface EnvVar {
  key: string;
  required: boolean;
  minLength?: number;
  description: string;
}

const ENV_VARS: EnvVar[] = [
  { key: 'MONGODB_URI',           required: true,  description: 'MongoDB Atlas connection string' },
  { key: 'JWT_SECRET',            required: true,  minLength: 32, description: 'JWT signing secret (min 32 chars)' },
  { key: 'CLOUDINARY_CLOUD_NAME', required: false, description: 'Cloudinary cloud name' },
  { key: 'CLOUDINARY_API_KEY',    required: false, description: 'Cloudinary API key' },
  { key: 'CLOUDINARY_API_SECRET', required: false, description: 'Cloudinary API secret' },
  { key: 'NEXTAUTH_URL',          required: false, description: 'Canonical site URL (production)' },
];

const INSECURE_DEFAULTS = [
  'your-secret-key-change-in-production',
  'dev-secret-change-in-production',
  'changeme',
];

export function validateAndLogEnv(): void {
  const errors: string[]   = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  for (const v of ENV_VARS) {
    const val = process.env[v.key];
    if (!val) {
      const msg = `Missing env var: ${v.key} — ${v.description}`;
      v.required ? errors.push(msg) : warnings.push(`⚠️  Optional ${msg}`);
      continue;
    }
    if (v.minLength && val.length < v.minLength) {
      errors.push(`${v.key} is too short (${val.length} chars). Minimum: ${v.minLength}`);
    }
  }

  const jwtSecret = process.env.JWT_SECRET || '';
  if (INSECURE_DEFAULTS.some(d => jwtSecret.includes(d))) {
    errors.push('JWT_SECRET is set to an insecure default value. Generate a proper secret.');
  }

  warnings.forEach(w => logger.warn(w));

  if (errors.length > 0) {
    errors.forEach(e => logger.error(`🔴 ${e}`));
    if (isProduction) {
      throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
    }
  } else {
    logger.info('✅ Environment variables validated.');
  }
}
