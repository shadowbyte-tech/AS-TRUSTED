import { logger } from './logger';

interface EnvVar {
  key: string;
  required: boolean;
  minLength?: number;
  description: string;
}

const REQUIRED_ENV_VARS: EnvVar[] = [
  {
    key: 'MONGODB_URI',
    required: true,
    description: 'MongoDB connection string (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname)',
  },
  {
    key: 'JWT_SECRET',
    required: true,
    minLength: 32,
    description: 'Secret key for signing JWTs. Must be at least 32 characters long.',
  },
  {
    key: 'CLOUDINARY_CLOUD_NAME',
    required: false,
    description: 'Cloudinary cloud name for image uploads.',
  },
  {
    key: 'CLOUDINARY_API_KEY',
    required: false,
    description: 'Cloudinary API key.',
  },
  {
    key: 'CLOUDINARY_API_SECRET',
    required: false,
    description: 'Cloudinary API secret.',
  },
  {
    key: 'NEXTAUTH_URL',
    required: false,
    description: 'The canonical URL of your site (required for production). e.g. https://astrustedconsultancy.com',
  },
];

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates all environment variables.
 * Throws in production for missing required vars.
 * Warns in development.
 */
export function validateEnv(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  for (const envVar of REQUIRED_ENV_VARS) {
    const value = process.env[envVar.key];

    if (!value) {
      const message = `Missing env var: ${envVar.key} — ${envVar.description}`;
      if (envVar.required) {
        errors.push(message);
      } else {
        warnings.push(`⚠️  Optional ${message}`);
      }
      continue;
    }

    if (envVar.minLength && value.length < envVar.minLength) {
      const message = `Env var ${envVar.key} is too short (${value.length} chars). Minimum: ${envVar.minLength} chars.`;
      if (envVar.required) {
        errors.push(message);
      } else {
        warnings.push(`⚠️  ${message}`);
      }
    }
  }

  // Special check: warn if JWT_SECRET is default
  if (process.env.JWT_SECRET === 'your-secret-key-change-in-production') {
    errors.push('JWT_SECRET is set to the default insecure value. Please set a unique secret.');
  }

  if (errors.length > 0 && isProduction) {
    const errorMessage = [
      '🔴 FATAL: Missing or invalid required environment variables:',
      ...errors.map((e) => `  → ${e}`),
      '',
      'Set these variables in your .env.local file or deployment environment.',
      'See .env.example for reference.',
    ].join('\n');
    throw new Error(errorMessage);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Logs validation results (dev-friendly).
 * In production, throws if invalid.
 */
export function validateAndLogEnv(): void {
  try {
    const result = validateEnv();
    if (result.warnings.length > 0) {
      result.warnings.forEach((w) => logger.warn(w));
    }
    if (result.errors.length > 0) {
      result.errors.forEach((e) => logger.error(`🔴 ${e}`));
    } else {
      logger.info('✅ Environment variables validated successfully.');
    }
  } catch (error) {
    logger.error(error instanceof Error ? error.message : String(error));
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
}
