

export type PropertyType = 'Plot' | 'House' | 'Land';
export type PropertyStatus = 'Available' | 'Reserved' | 'Sold' | 'Under Negotiation' | 'Under Construction';
export type PropertyCategory = 'Normal' | 'Premium' | 'Luxury';
export type HouseType = 'Independent' | 'Villa' | 'Apartment' | 'Duplex' | 'Penthouse';
export type LandType = 'Agricultural' | 'Commercial' | 'Residential' | 'Industrial';

export type BaseProperty = {
  id: string;
  propertyNumber: string;
  propertyType: PropertyType;
  villageName: string;
  areaName: string;
  imageUrl: string;
  imageHint: string;
  description?: string;
  price?: number;
  priceNegotiable?: boolean;
  status?: PropertyStatus;
  category?: PropertyCategory;
  images?: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type Plot = BaseProperty & {
  propertyType: 'Plot';
  plotNumber: string;
  plotSize: string;
  plotFacing: 'North' | 'South' | 'East' | 'West' | 'North-East' | 'North-West' | 'South-East' | 'South-West';
  pricePerSqft?: number;
};

export type House = BaseProperty & {
  propertyType: 'House';
  houseSize: string;
  bedrooms: number;
  bathrooms: number;
  floors: number;
  houseType: 'Independent' | 'Villa' | 'Apartment' | 'Duplex' | 'Penthouse';
  furnished: boolean;
  parking: boolean;
  amenities: string[];
  yearBuilt?: number;
};

export type Land = BaseProperty & {
  propertyType: 'Land';
  landSize: string;
  landType: 'Agricultural' | 'Commercial' | 'Residential' | 'Industrial';
  zoning: string;
  roadAccess: boolean;
  waterConnection: boolean;
  electricityConnection: boolean;
  soilType?: string;
  topography?: string;
};

export type Property = Plot | House | Land;

// Legacy Plot type for backward compatibility
export type LegacyPlot = Omit<Plot, 'propertyType' | 'propertyNumber'> & {
  plotNumber: string;
};

export type PlotFacing = Plot['plotFacing'];

export type User = {
    id: string;
    email: string;
    role: 'Owner' | 'User' | 'Premium';
    name?: string;
    phone?: string;
    location?: string;
    blocked?: boolean;
    blockedAt?: string;
    createdAt?: string;
    lastLogin?: string;
    updatedAt?: string;
};

export type Inquiry = {
  id: string;
  plotNumber: string;
  name: string;
  email: string;
  message: string;
  receivedAt: string; // ISO date string
};

export type Contact = {
    id: string;
    name: string;
    phone: string;
    email: string;
    type: 'Seller' | 'Buyer' | 'Investor' | 'Agent' | 'Other';
    notes?: string;
}

export type Registration = {
  id:string;
  name: string;
  phone: string;
  email: string;
  notes?: string;
  createdAt: string; // ISO date string
  isNew?: boolean;
};


export type State = {
  errors?: {
    plotNumber?: string[];
    villageName?: string[];
    areaName?: string[];
    plotSize?: string[];
    plotFacing?: string[];
    imageUrl?: string[];
    email?: string[];
    password?: string[];
    name?: string[];
    phone?: string[];
    type?: string[];
    notes?: string[];
    message?: string[];
    description?: string[];
    price?: string[];
    category?: string[];
    status?: string[];
  };
  message?: string | null;
  success?: boolean;
  plotId?: string | null;
  registration?: Registration | null;
};
