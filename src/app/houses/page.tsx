'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  MapPin, 
  TrendingUp, 
  Shield,
  Home,
  Ruler,
  IndianRupee,
  Eye,
  Heart,
  Filter,
  Bed,
  Bath,
  Layers,
  Car
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/definitions';

export default function HousesPage() {
  const [houses, setHouses] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    houseType: 'all',
    bedrooms: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchHouses();
  }, []);

  const fetchHouses = async () => {
    try {
      const response = await fetch('/api/properties?propertyType=House');
      if (response.ok) {
        const housesResponse = await response.json();
        setHouses(housesResponse.data || []);
      } else {
        console.error('Failed to fetch houses:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch houses:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHouses = houses.filter(house => {
    if (filters.location && !house.villageName.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.priceRange && house.price) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (house.price < min || house.price > max) {
        return false;
      }
    }
    if (filters.houseType !== 'all' && house.propertyType === 'House' && house.houseType !== filters.houseType) {
      return false;
    }
    if (filters.bedrooms !== 'all' && house.propertyType === 'House' && house.bedrooms !== parseInt(filters.bedrooms)) {
      return false;
    }
    if (filters.status !== 'all' && house.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getHouseTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Independent': 'bg-blue-500',
      'Villa': 'bg-purple-500',
      'Apartment': 'bg-green-500',
      'Duplex': 'bg-orange-500',
      'Penthouse': 'bg-red-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading houses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black font-headline mb-2">
            Residential Houses
          </h1>
          <p className="text-muted-foreground">
            Find your dream home from our curated collection of residential properties
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-primary/20">
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="font-medium">Filters:</span>
              </div>
              
              <input
                type="text"
                placeholder="Search location..."
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              />

              <select
                value={filters.priceRange}
                onChange={(e) => setFilters(prev => ({ ...prev, priceRange: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="">All Prices</option>
                <option value="0-2000000">Under ₹20L</option>
                <option value="2000000-5000000">₹20L - ₹50L</option>
                <option value="5000000-10000000">₹50L - ₹1Cr</option>
                <option value="10000000-999999999">Above ₹1Cr</option>
              </select>

              <select
                value={filters.houseType}
                onChange={(e) => setFilters(prev => ({ ...prev, houseType: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="Independent">Independent</option>
                <option value="Villa">Villa</option>
                <option value="Apartment">Apartment</option>
                <option value="Duplex">Duplex</option>
                <option value="Penthouse">Penthouse</option>
              </select>

              <select
                value={filters.bedrooms}
                onChange={(e) => setFilters(prev => ({ ...prev, bedrooms: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="all">All Bedrooms</option>
                <option value="1">1 BHK</option>
                <option value="2">2 BHK</option>
                <option value="3">3 BHK</option>
                <option value="4">4 BHK</option>
                <option value="5">5+ BHK</option>
              </select>

              <select
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="all">All Status</option>
                <option value="Available">Available</option>
                <option value="Reserved">Reserved</option>
                <option value="Sold">Sold</option>
                <option value="Under Negotiation">Under Negotiation</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Results count */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            Showing {filteredHouses.length} of {houses.length} houses
          </p>
        </div>

        {/* Houses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHouses.map((house) => (
            <Card key={house.id} className="overflow-hidden border-primary/20 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={house.imageUrl || '/api/placeholder/400/300'}
                  alt={`House in ${house.villageName}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-blue-500 text-white">
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span>House</span>
                    </div>
                  </Badge>
                </div>
                {house.propertyType === 'House' && house.houseType && (
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getHouseTypeColor(house.houseType)} text-white`}>
                      {house.houseType}
                    </Badge>
                  </div>
                )}
                {house.status && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant={house.status === 'Available' ? 'default' : 'secondary'}>
                      {house.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1">
                    {house.propertyNumber} - {house.villageName}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{house.areaName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{house.propertyType === 'House' ? house.houseSize : house.propertyType === 'Plot' ? house.plotSize : house.landSize}</span>
                  </div>
                  {house.propertyType === 'House' && (
                    <>
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4" />
                        <span>{house.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4" />
                        <span>{house.bathrooms} Baths</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {house.propertyType === 'House' && house.floors && (
                    <div className="flex items-center gap-1">
                      <Layers className="h-4 w-4" />
                      <span>{house.floors} Floors</span>
                    </div>
                  )}
                  {house.propertyType === 'House' && house.parking && (
                    <div className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      <span>Parking</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{house.price ? house.price.toLocaleString('en-IN') : 'Price on Request'}
                    </div>
                    {house.priceNegotiable && (
                      <div className="text-sm text-muted-foreground">Negotiable</div>
                    )}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4">
                  <Link href={`/property/${house.id}`}>
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHouses.length === 0 && (
          <div className="text-center py-12">
            <Home className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No houses found matching your filters.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
