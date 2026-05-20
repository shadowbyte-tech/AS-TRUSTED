'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search, 
  Filter, 
  X, 
  Home, 
  Building, 
  Trees, 
  MapPin,
  IndianRupee,
  Square,
  Bed,
  Bath,
  Car,
  Mic,
  MicOff
} from 'lucide-react';
import type { PropertyType } from '@/lib/definitions';
import { useAuth } from '@/lib/auth-context';
import PremiumUpgradeModal from '@/components/premium-upgrade-modal';
import { getAllKamareddyVillages } from '@/lib/kamareddy-villages';

interface PropertyFilters {
  searchTerm: string;
  propertyType: PropertyType | 'all';
  minPrice: number;
  maxPrice: number;
  minSize: number;
  maxSize: number;
  village: string;
  category: 'all' | 'Normal' | 'Premium' | 'Luxury';
  status: 'all' | 'Available' | 'Reserved' | 'Sold' | 'Under Negotiation';
  amenities: string[];
  plotFacing: string;
  houseType: string;
  landType: string;
  furnished: boolean;
  parking: boolean;
}

interface PropertySearchFiltersProps {
  filters: PropertyFilters;
  onFiltersChange: (filters: PropertyFilters) => void;
  onReset: () => void;
  properties: any[];
}

const amenityOptions = [
  'Power Backup', 'Water Supply', 'Security', 'Gym', 'Swimming Pool', 
  'Garden', 'Parking', 'Clubhouse', 'Children Play Area', 'Jogging Track'
];

const plotFacingOptions = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
const houseTypeOptions = ['Independent', 'Villa', 'Apartment', 'Duplex', 'Penthouse'];
const landTypeOptions = ['Agricultural', 'Commercial', 'Residential', 'Industrial'];

export default function PropertySearchFilters({ 
  filters, 
  onFiltersChange, 
  onReset, 
  properties 
}: PropertySearchFiltersProps) {
  const { user } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState({ name: '', description: '' });
  const [isListening, setIsListening] = useState(false);

  const startVoiceSearch = () => {
    const SpeechRecognition = 
      (window as any).SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
      
    if (!SpeechRecognition) {
      alert("Voice search is not supported in this browser. Please try Google Chrome or MS Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-IN'; // Works great for Indian accents and keywords (e.g. Kamareddy, plot)

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      updateFilter('searchTerm', transcript);
      
      const speech = transcript.toLowerCase();
      
      // Auto-extract type
      if (speech.includes('plot')) {
        updateFilter('propertyType', 'Plot');
      } else if (speech.includes('house') || speech.includes('villa')) {
        updateFilter('propertyType', 'House');
      } else if (speech.includes('land')) {
        updateFilter('propertyType', 'Land');
      }

      // Auto-extract village name
      const villages = ['devanpally', 'tekrial', 'adloor', 'kyasampally', 'rameshwarpally', 'kamareddy', 'vidhya nagar'];
      for (const v of villages) {
        if (speech.includes(v)) {
          const match = v === 'vidhya nagar' ? 'Vidhya Nagar Colony' : v.charAt(0).toUpperCase() + v.slice(1);
          updateFilter('village', match);
          break;
        }
      }

      // Auto-extract category
      if (speech.includes('premium') || speech.includes('vip')) {
        updateFilter('category', 'Premium');
      } else if (speech.includes('luxury')) {
        updateFilter('category', 'Luxury');
      } else if (speech.includes('normal') || speech.includes('budget')) {
        updateFilter('category', 'Normal');
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Handle premium category selection
  const handleCategoryChange = (value: string) => {
    if ((value === 'Premium' || value === 'Luxury') && !user) {
      // Show premium modal for non-authenticated users
      setPremiumFeature({
        name: value,
        description: `Access to ${value} properties requires premium membership. Get unlimited access to exclusive high-value properties and premium features.`
      });
      setShowPremiumModal(true);
      return; // Don't update the filter
    }
    updateFilter('category', value);
  };

  // Get all villages from Kamareddy district
  const villages = useMemo(() => {
    return getAllKamareddyVillages();
  }, []);

  // Calculate price and size ranges from properties
  const priceRange = useMemo(() => {
    const prices = properties.map(p => p.price || 0).filter(p => p > 0);
    if (prices.length === 0) return { min: 0, max: 10000000 };
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [properties]);

  const sizeRange = useMemo(() => {
    const sizes = properties.map(p => {
      if (p.propertyType === 'Plot') return parseFloat(p.plotSize?.split(' ')[0] || '0');
      if (p.propertyType === 'House') return parseFloat(p.houseSize?.split(' ')[0] || '0');
      if (p.propertyType === 'Land') return parseFloat(p.landSize?.split(' ')[0] || '0');
      return 0;
    }).filter(s => s > 0);
    if (sizes.length === 0) return { min: 0, max: 5000 };
    return {
      min: Math.min(...sizes),
      max: Math.max(...sizes)
    };
  }, [properties]);

  const updateFilter = (key: keyof PropertyFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const updateAmenity = (amenity: string, checked: boolean) => {
    const newAmenities = checked 
      ? [...filters.amenities, amenity]
      : filters.amenities.filter(a => a !== amenity);
    updateFilter('amenities', newAmenities);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `${(price / 10000000).toFixed(1)}Cr`;
    if (price >= 100000) return `${(price / 100000).toFixed(0)}L`;
    return `${price.toLocaleString()}`;
  };

  const getPropertyIcon = (type: PropertyType) => {
    switch (type) {
      case 'Plot': return <Trees className="h-4 w-4" />;
      case 'House': return <Home className="h-4 w-4" />;
      case 'Land': return <MapPin className="h-4 w-4" />;
      default: return <Building className="h-4 w-4" />;
    }
  };

  return (
    <Card className="sticky top-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReset}>
              <X className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Less' : 'More'}
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isListening ? "Listening... Speak now" : "Search by location, description..."}
              value={filters.searchTerm}
              onChange={(e) => updateFilter('searchTerm', e.target.value)}
              className="pl-10 pr-10 bg-background text-foreground border-input"
              disabled={isListening}
            />
            <button
              type="button"
              onClick={startVoiceSearch}
              className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-muted transition-colors ${
                isListening ? 'text-red-500 animate-pulse bg-red-500/10' : 'text-muted-foreground'
              }`}
              title="Voice Search"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Property Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Property Type</label>
          <Select value={filters.propertyType} onValueChange={(value: any) => updateFilter('propertyType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Plot">
                <div className="flex items-center gap-2">
                  <Trees className="h-4 w-4" />
                  Plots
                </div>
              </SelectItem>
              <SelectItem value="House">
                <div className="flex items-center gap-2">
                  <Home className="h-4 w-4" />
                  Houses
                </div>
              </SelectItem>
              <SelectItem value="Land">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Lands
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Village/Area */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Village/Area</label>
          <Select value={filters.village} onValueChange={(value) => updateFilter('village', value)}>
            <SelectTrigger>
              <SelectValue placeholder="All Villages" />
            </SelectTrigger>
            <SelectContent className="max-h-60 overflow-y-auto">
              {villages.map(village => (
                <SelectItem key={village} value={village}>{village}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Price Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Price: {formatPrice(filters.minPrice)} - {formatPrice(filters.maxPrice)}
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minPrice, filters.maxPrice]}
              onValueChange={([min, max]) => {
                updateFilter('minPrice', min);
                updateFilter('maxPrice', max);
              }}
              min={priceRange.min}
              max={priceRange.max}
              step={100000}
              className="w-full"
            />
          </div>
        </div>

        {/* Size Range */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Size: {filters.minSize} - {filters.maxSize} sqft
          </label>
          <div className="px-2">
            <Slider
              value={[filters.minSize, filters.maxSize]}
              onValueChange={([min, max]) => {
                updateFilter('minSize', min);
                updateFilter('maxSize', max);
              }}
              min={sizeRange.min}
              max={sizeRange.max}
              step={100}
              className="w-full"
            />
          </div>
        </div>

        {/* Category and Status */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Normal">Normal</SelectItem>
                <SelectItem value="Premium">Premium</SelectItem>
                <SelectItem value="Luxury">Luxury</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select value={filters.status} onValueChange={(value: any) => updateFilter('status', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="Reserved">Reserved</SelectItem>
                <SelectItem value="Sold">Sold</SelectItem>
                <SelectItem value="Under Negotiation">Under Negotiation</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expanded Filters */}
        {isExpanded && (
          <div className="space-y-4 border-t pt-4">
            {/* Type-specific filters */}
            {filters.propertyType === 'Plot' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Plot Facing</label>
                <Select value={filters.plotFacing} onValueChange={(value) => updateFilter('plotFacing', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Direction" />
                  </SelectTrigger>
                  <SelectContent>
                    {plotFacingOptions.map(facing => (
                      <SelectItem key={facing} value={facing}>{facing}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {filters.propertyType === 'House' && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">House Type</label>
                  <Select value={filters.houseType} onValueChange={(value) => updateFilter('houseType', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {houseTypeOptions.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="furnished" 
                      checked={filters.furnished}
                      onCheckedChange={(checked) => updateFilter('furnished', !!checked)}
                    />
                    <label htmlFor="furnished" className="text-sm">Furnished</label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="parking" 
                      checked={filters.parking}
                      onCheckedChange={(checked) => updateFilter('parking', !!checked)}
                    />
                    <label htmlFor="parking" className="text-sm">Parking</label>
                  </div>
                </div>
              </>
            )}

            {filters.propertyType === 'Land' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Land Type</label>
                <Select value={filters.landType} onValueChange={(value) => updateFilter('landType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Any Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {landTypeOptions.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Amenities (for Houses) */}
            {filters.propertyType === 'House' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">Amenities</label>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.slice(0, 6).map(amenity => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox 
                        id={amenity} 
                        checked={filters.amenities.includes(amenity)}
                        onCheckedChange={(checked) => updateAmenity(amenity, !!checked)}
                      />
                      <label htmlFor={amenity} className="text-xs">{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Active Filters Summary */}
        <div className="flex flex-wrap gap-1">
          {filters.propertyType !== 'all' && (
            <Badge variant="secondary" className="text-xs">
              {getPropertyIcon(filters.propertyType)}
              {filters.propertyType}
            </Badge>
          )}
          {filters.village && (
            <Badge variant="secondary" className="text-xs">{filters.village}</Badge>
          )}
          {filters.category !== 'all' && (
            <Badge variant="secondary" className="text-xs">{filters.category}</Badge>
          )}
          {filters.status !== 'all' && (
            <Badge variant="secondary" className="text-xs">{filters.status}</Badge>
          )}
        </div>
      </CardContent>
      
      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        featureName={premiumFeature.name}
        featureDescription={premiumFeature.description}
      />
    </Card>
  );
}
