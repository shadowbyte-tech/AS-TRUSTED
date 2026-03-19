'use client';

// Unified Property List Component - Fixed version

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, 
  Share2, 
  Phone, 
  MessageCircle, 
  Eye,
  MapPin,
  IndianRupee,
  Square,
  Bed,
  Bath,
  Car,
  Home,
  Trees,
  Building,
  Star,
  ChevronRight,
  GitCompare
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/definitions';

interface UnifiedPropertyListProps {
  properties: Property[];
  viewMode?: 'grid' | 'list';
  showCompare?: boolean;
  onCompareToggle?: (propertyId: string) => void;
  compareList?: string[];
  onWishlistToggle?: (propertyId: string) => void;
  wishlist?: string[];
}

import PropertyCard from './PropertyCard';

export default function UnifiedPropertyList({ 
  properties, 
  viewMode = 'grid',
  showCompare = true,
  onCompareToggle,
  compareList = [],
  onWishlistToggle,
  wishlist = []
}: UnifiedPropertyListProps) {
  if (viewMode === 'list') {
    return (
      <div className="space-y-4">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property as any}
            viewMode="list"
            onWishlistToggle={onWishlistToggle}
            wishlist={wishlist}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {properties.map((property) => (
        <PropertyCard
          key={property.id}
          property={property as any}
          variant={property.category === 'Premium' ? 'premium' : property.category === 'Luxury' ? 'luxury' : 'default'}
          onWishlistToggle={onWishlistToggle}
          wishlist={wishlist}
        />
      ))}
    </div>
  );
}
