import { z } from 'zod';
import type { PropertyType, HouseType, LandType } from './definitions';

// Base property validation
const BasePropertySchema = z.object({
  propertyNumber: z.string().min(1, 'Property number is required'),
  propertyType: z.enum(['Plot', 'House', 'Land']),
  villageName: z.string().min(1, 'Village name is required'),
  areaName: z.string().min(1, 'Area name is required'),
  imageUrl: z.string().optional(),
  imageHint: z.string().optional(),
  description: z.string().optional(),
  price: z.number().min(0, 'Price must be positive'),
  priceNegotiable: z.boolean().default(false),
  status: z.enum(['Available', 'Reserved', 'Sold', 'Under Negotiation', 'Under Construction']).default('Available'),
  category: z.enum(['Normal', 'Premium', 'Luxury']).default('Normal'),
  images: z.array(z.string()).default([]),
});

// Plot-specific validation
const PlotSchema = BasePropertySchema.extend({
  propertyType: z.literal('Plot'),
  plotSize: z.string().min(1, 'Plot size is required'),
  plotFacing: z.enum(['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West']).optional(),
  pricePerSqft: z.number().min(0).optional(),
});

// House-specific validation
const HouseSchema = BasePropertySchema.extend({
  propertyType: z.literal('House'),
  houseSize: z.string().min(1, 'House size is required'),
  bedrooms: z.number().min(1, 'At least 1 bedroom required'),
  bathrooms: z.number().min(1, 'At least 1 bathroom required'),
  floors: z.number().min(1, 'At least 1 floor required'),
  houseType: z.enum(['Independent', 'Villa', 'Apartment', 'Duplex', 'Penthouse']).optional(),
  furnished: z.boolean().default(false),
  parking: z.boolean().default(false),
  amenities: z.array(z.string()).default([]),
  yearBuilt: z.number().min(1900).max(new Date().getFullYear()).optional(),
});

// Land-specific validation
const LandSchema = BasePropertySchema.extend({
  propertyType: z.literal('Land'),
  landSize: z.string().min(1, 'Land size is required'),
  landType: z.enum(['Agricultural', 'Commercial', 'Residential', 'Industrial']).optional(),
  zoning: z.string().min(1, 'Zoning information is required'),
  roadAccess: z.boolean().default(false),
  waterConnection: z.boolean().default(false),
  electricityConnection: z.boolean().default(false),
  soilType: z.string().optional(),
  topography: z.string().optional(),
});

// Union schema for all property types
export const PropertySchema = z.discriminatedUnion('propertyType', [
  PlotSchema,
  HouseSchema,
  LandSchema,
]);

// Type inference
export type PropertyInput = z.infer<typeof PropertySchema>;

// Export individual schemas for specific use cases
export { PlotSchema, HouseSchema, LandSchema };
