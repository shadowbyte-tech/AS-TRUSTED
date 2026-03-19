'use client';

import React, { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  MapPin, 
  ArrowRight, 
  Ruler, 
  Compass, 
  Bed, 
  Bath, 
  Car, 
  Trees, 
  Home, 
  Building,
  Heart,
  Share2,
  Phone
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { Property } from '@/lib/definitions';
import { motion, AnimatePresence } from 'framer-motion';

interface PropertyCardProps {
  property: Property;
  onContact?: (property: Property) => void;
  onShare?: (property: Property) => void;
  onFavorite?: (propertyId: string) => void;
  onWishlistToggle?: (propertyId: string) => void;
  isFavorite?: boolean;
  wishlist?: string[];
  viewMode?: 'grid' | 'list';
  variant?: 'default' | 'premium' | 'luxury';
}

function PropertyCard({ 
  property, 
  onContact, 
  onShare, 
  onFavorite, 
  onWishlistToggle,
  isFavorite = false,
  wishlist = [],
  viewMode = 'grid',
  variant = 'default'
}: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const isSelected = wishlist.includes(property.id) || isFavorite;
  const onToggle = onWishlistToggle || onFavorite;

  const getPropertyIcon = () => {
    switch (property.propertyType) {
      case 'Plot': return <Trees className="h-4 w-4" />;
      case 'House': return <Home className="h-4 w-4" />;
      case 'Land': return <Building className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  const renderDetails = () => {
    if (property.propertyType === 'Plot') {
      return (
        <>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5 text-primary" />
            <span>{property.plotSize}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Compass className="h-3.5 w-3.5 text-primary" />
            <span>{property.plotFacing}</span>
          </div>
        </>
      );
    }
    if (property.propertyType === 'House') {
      return (
        <>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bed className="h-3.5 w-3.5 text-primary" />
            <span>{property.bedrooms} BHK</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Bath className="h-3.5 w-3.5 text-primary" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Home className="h-3.5 w-3.5 text-primary" />
            <span>{property.houseSize}</span>
          </div>
        </>
      );
    }
    if (property.propertyType === 'Land') {
      return (
        <>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Ruler className="h-3.5 w-3.5 text-primary" />
            <span>{property.landSize}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Building className="h-3.5 w-3.5 text-primary" />
            <span>{property.landType}</span>
          </div>
        </>
      );
    }
    return null;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'Reserved': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'Sold': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-slate-500/10 text-slate-600 border-slate-500/20';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group"
    >
      <Card className="h-full overflow-hidden glass hover:shadow-2xl transition-all duration-500 border-primary/10 hover:border-primary/30">
        <CardHeader className="p-0 relative h-56 overflow-hidden">
          <Image
            src={property.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&q=80&w=600'}
            alt={property.propertyNumber}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={75}
            priority={false}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            <Badge className={`${getStatusColor(property.status || 'Available')} backdrop-blur-md border`}>
              {property.status || 'Available'}
            </Badge>
            {property.category === 'Premium' && (
              <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30 backdrop-blur-md">
                Premium
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {onFavorite && (
              <Button
                size="icon"
                variant="secondary"
                className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 text-white"
                onClick={(e) => {
                  e.preventDefault();
                  onFavorite(property.id);
                }}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-rose-500 text-rose-500' : ''}`} />
              </Button>
            )}
          </div>

          <div className="absolute bottom-3 left-3 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20">
            <p className="text-white font-bold text-sm">
              {formatPrice(property.price)}
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-5 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1 px-2 rounded-md bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider">
                {property.propertyType}
              </span>
              <h3 className="text-lg font-bold truncate group-hover:text-primary transition-colors">
                {property.propertyNumber}
              </h3>
            </div>
            <div className="flex items-center text-muted-foreground">
              <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary/60" />
              <span className="text-xs font-medium truncate">{property.areaName}, {property.villageName}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 py-3 border-y border-primary/5">
            {renderDetails()}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 flex gap-2">
          <Button asChild className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-lg shadow-primary/20 transition-all duration-300">
            <Link href={`/properties/${property.id}`}>
              Details <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
          {onContact && (
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-xl border-primary/20 hover:bg-primary/5"
              onClick={() => onContact(property)}
            >
              <Phone className="h-4 w-4 text-primary" />
            </Button>
          )}
          {onShare && (
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-xl border-primary/20 hover:bg-primary/5"
              onClick={() => onShare(property)}
            >
              <Share2 className="h-4 w-4 text-primary" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}

const PropertyCardMemoized = memo(PropertyCard);
export default PropertyCardMemoized;
