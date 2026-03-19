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
  Building,
  Ruler,
  IndianRupee,
  Eye,
  Heart,
  Filter,
  Zap,
  Droplets,
  Lightbulb
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Property } from '@/lib/definitions';

export default function LandPage() {
  const [lands, setLands] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    landType: 'all',
    zoning: 'all',
    status: 'all'
  });

  useEffect(() => {
    fetchLands();
  }, []);

  const fetchLands = async () => {
    try {
      const response = await fetch('/api/properties?propertyType=Land');
      if (response.ok) {
        const landsResponse = await response.json();
        setLands(landsResponse.data || []);
      } else {
        console.error('Failed to fetch lands:', response.statusText);
      }
    } catch (error) {
      console.error('Failed to fetch lands:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLands = lands.filter(land => {
    if (filters.location && !land.villageName.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.priceRange && land.price) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (land.price < min || land.price > max) {
        return false;
      }
    }
    if (filters.landType !== 'all' && land.propertyType === 'Land' && land.landType !== filters.landType) {
      return false;
    }
    if (filters.zoning !== 'all' && land.propertyType === 'Land' && land.zoning !== filters.zoning) {
      return false;
    }
    if (filters.status !== 'all' && land.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getLandTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'Agricultural': 'bg-green-500',
      'Commercial': 'bg-blue-500',
      'Residential': 'bg-orange-500',
      'Industrial': 'bg-gray-500'
    };
    return colors[type] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading land properties...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black font-headline mb-2">
            Land Properties
          </h1>
          <p className="text-muted-foreground">
            Explore premium land parcels for agricultural, commercial, and residential development
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
                <option value="0-5000000">Under ₹50L</option>
                <option value="5000000-10000000">₹50L - ₹1Cr</option>
                <option value="10000000-20000000">₹1Cr - ₹2Cr</option>
                <option value="20000000-999999999">Above ₹2Cr</option>
              </select>

              <select
                value={filters.landType}
                onChange={(e) => setFilters(prev => ({ ...prev, landType: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="all">All Types</option>
                <option value="Agricultural">Agricultural</option>
                <option value="Commercial">Commercial</option>
                <option value="Residential">Residential</option>
                <option value="Industrial">Industrial</option>
              </select>

              <select
                value={filters.zoning}
                onChange={(e) => setFilters(prev => ({ ...prev, zoning: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="all">All Zoning</option>
                <option value="R1">R1 (Residential)</option>
                <option value="R2">R2 (Residential)</option>
                <option value="C1">C1 (Commercial)</option>
                <option value="C2">C2 (Commercial)</option>
                <option value="A1">A1 (Agricultural)</option>
                <option value="I1">I1 (Industrial)</option>
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
            Showing {filteredLands.length} of {lands.length} land properties
          </p>
        </div>

        {/* Land Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLands.map((land) => (
            <Card key={land.id} className="overflow-hidden border-primary/20 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={land.imageUrl || '/api/placeholder/400/300'}
                  alt={`Land in ${land.villageName}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-orange-500 text-white">
                    <div className="flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      <span>Land</span>
                    </div>
                  </Badge>
                </div>
                {land.propertyType === 'Land' && land.landType && (
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getLandTypeColor(land.landType)} text-white`}>
                      {land.landType}
                    </Badge>
                  </div>
                )}
                {land.status && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant={land.status === 'Available' ? 'default' : 'secondary'}>
                      {land.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1">
                    {land.propertyNumber} - {land.villageName}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{land.areaName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{land.propertyType === 'Land' ? land.landSize : land.propertyType === 'House' ? land.houseSize : land.plotSize}</span>
                  </div>
                  {land.propertyType === 'Land' && land.zoning && (
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      <span>{land.zoning}</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  {land.propertyType === 'Land' && (
                    <>
                      {land.roadAccess && (
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          <span>Road Access</span>
                        </div>
                      )}
                      {land.waterConnection && (
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4" />
                          <span>Water</span>
                        </div>
                      )}
                      {land.electricityConnection && (
                        <div className="flex items-center gap-1">
                          <Lightbulb className="h-4 w-4" />
                          <span>Electricity</span>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{land.price ? land.price.toLocaleString('en-IN') : 'Price on Request'}
                    </div>
                    {land.priceNegotiable && (
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
                  <Link href={`/property/${land.id}`}>
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredLands.length === 0 && (
          <div className="text-center py-12">
            <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No land properties found matching your filters.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
