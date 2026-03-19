import { z } from 'zod';
import { VALIDATION } from './constants';

export const InquirySchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(VALIDATION.NAME_MAX_LENGTH, `Name must be less than ${VALIDATION.NAME_MAX_LENGTH} characters`),
  email: z.string()
    .email('Invalid email format')
    .max(VALIDATION.EMAIL_MAX_LENGTH, `Email must be less than ${VALIDATION.EMAIL_MAX_LENGTH} characters`),
  message: z.string()
    .min(VALIDATION.MESSAGE_MIN_LENGTH, `Message must be at least ${VALIDATION.MESSAGE_MIN_LENGTH} characters`)
    .max(VALIDATION.MESSAGE_MAX_LENGTH, `Message must be less than ${VALIDATION.MESSAGE_MAX_LENGTH} characters`),
  plotNumber: z.string().min(1, 'Plot number is required'),
});

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const PlotSchema = z.object({
  plotNumber: z.string().min(1, 'Plot number is required'),
  villageName: z.string().min(1, 'Village name is required'),
  areaName: z.string().min(1, 'Area name is required'),
  plotSize: z.string().min(1, 'Plot size is required'),
  plotFacing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']),
  price: z.number().optional(),
  priceNegotiable: z.boolean().default(false),
  description: z.string().max(VALIDATION.DESCRIPTION_MAX_LENGTH).optional(),
  imageUrl: z.string().url('Invalid image URL').optional(),
  category: z.enum(['Normal', 'Premium']).default('Normal'),
  status: z.enum(['Available', 'Reserved', 'Sold', 'Under Negotiation']).default('Available'),
});
