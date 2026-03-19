/**
 * Application constants
 */

// User roles
export const USER_ROLES = {
  OWNER: 'Owner',
  USER: 'User',
  PREMIUM: 'Premium',
  ELITE: 'Elite',
} as const;

// Monetization tiers (ordered by ascending access level)
export const MONETIZATION_TIERS = {
  FREE: 'User',
  PREMIUM: 'Premium',
  ELITE: 'Elite',
  OWNER: 'Owner',
} as const;

// Roles that have access to premium features
export const PREMIUM_ROLES = ['Premium', 'Elite', 'Owner'] as const;
// Roles that have access to elite-only features
export const ELITE_ROLES = ['Elite', 'Owner'] as const;

// Contact types
export const CONTACT_TYPES = {
  SELLER: 'Seller',
  BUYER: 'Buyer',
} as const;

// Plot facing directions
export const PLOT_FACINGS = [
  'North',
  'South',
  'East',
  'West',
  'North-East',
  'North-West',
  'South-East',
  'South-West',
] as const;

// Plot status options
export const PLOT_STATUS = [
  'Available',
  'Reserved',
  'Sold',
  'Under Negotiation',
] as const;



// Validation constants
export const VALIDATION = {
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_MAX_LENGTH: 128,
  PLOT_NUMBER_MAX_LENGTH: 50,
  NAME_MAX_LENGTH: 100,
  EMAIL_MAX_LENGTH: 255,
  PHONE_MAX_LENGTH: 20,
  MESSAGE_MIN_LENGTH: 10,
  MESSAGE_MAX_LENGTH: 1000,
  NOTES_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 2000,
  IMAGE_MAX_SIZE: 4 * 1024 * 1024, // 4MB
} as const;

// API response messages
export const API_MESSAGES = {
  SUCCESS: {
    PLOT_CREATED: 'Plot created successfully.',
    PLOT_UPDATED: 'Plot updated successfully.',
    PLOT_DELETED: 'Plot deleted successfully.',
    USER_CREATED: 'User created successfully.',
    USER_DELETED: 'User deleted successfully.',
    PASSWORD_CHANGED: 'Password changed successfully.',
    INQUIRY_SUBMITTED: 'Inquiry submitted successfully.',
    CONTACT_CREATED: 'Contact created successfully.',
    CONTACT_UPDATED: 'Contact updated successfully.',
    CONTACT_DELETED: 'Contact deleted successfully.',
    REGISTRATION_SUBMITTED: 'Thank you for registering! We will contact you shortly.',
  },
  ERROR: {
    INVALID_CREDENTIALS: 'Invalid email or password.',
    USER_EXISTS: 'A user with this email already exists.',
    USER_NOT_FOUND: 'User not found.',
    PLOT_EXISTS: 'A plot with this number already exists in the same village.',
    PLOT_NOT_FOUND: 'Plot not found.',
    CONTACT_EXISTS: 'A contact with this email already exists.',
    CONTACT_NOT_FOUND: 'Contact not found.',
    REGISTRATION_EXISTS: 'This email address has already been registered.',
    INVALID_INPUT: 'Invalid input data.',
    INTERNAL_ERROR: 'An internal error occurred. Please try again.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    MISSING_FIELDS: 'Required fields are missing.',
    IMAGE_REQUIRED: 'An image file is required.',
    IMAGE_TOO_LARGE: 'Image must be less than 4MB.',
    INVALID_IMAGE: 'Only image files are allowed.',
  },
} as const;

// JWT configuration
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'HS256',
} as const;

// Cookie configuration
export const AUTH_COOKIES = {
  ACCESS_TOKEN: 'auth_access_token',
  REFRESH_TOKEN: 'auth_refresh_token',
  MAX_AGE_ACCESS: 15 * 60, // 15 minutes in seconds
  MAX_AGE_REFRESH: 7 * 24 * 60 * 60, // 7 days in seconds
} as const;
