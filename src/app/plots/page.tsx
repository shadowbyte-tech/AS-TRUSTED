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
  Trees,
  Ruler,
  IndianRupee,
  Eye,
  Heart,
  Filter,
  Crown,
  Lock
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import type { Property } from '@/lib/definitions';

export default function PlotsPage() {
  const { user } = useAuth();
  const [plots, setPlots] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    priceRange: '',
    facing: 'all',
    status: 'all'
  });

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await fetch('/api/properties', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          // Filter only Plot properties and apply premium gating
          const filteredPlots = (data.data || []).filter((property: Property) => 
            property.propertyType === 'Plot' && (user || property.category !== 'Premium')
          );
          setPlots(filteredPlots);
        } else {
          console.error('Failed to fetch plots:', response.statusText);
        }
      } catch (error) {
        console.error('Failed to fetch plots:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlots();
  }, [user]);

  const filteredPlots = plots.filter(plot => {
    if (filters.location && !plot.villageName.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }
    if (filters.priceRange && plot.price) {
      const [min, max] = filters.priceRange.split('-').map(Number);
      if (plot.price < min || plot.price > max) {
        return false;
      }
    }
    if (filters.facing !== 'all' && plot.propertyType === 'Plot' && plot.plotFacing !== filters.facing) {
      return false;
    }
    if (filters.status !== 'all' && plot.status !== filters.status) {
      return false;
    }
    return true;
  });

  const getFacingColor = (facing: string) => {
    const colors: Record<string, string> = {
      'North': 'bg-blue-500',
      'South': 'bg-green-500',
      'East': 'bg-orange-500',
      'West': 'bg-red-500',
      'North-East': 'bg-purple-500',
      'North-West': 'bg-indigo-500',
      'South-East': 'bg-yellow-500',
      'South-West': 'bg-pink-500'
    };
    return colors[facing] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background flex items-center justify-center">
        <p className="text-lg text-muted-foreground">Loading plots...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black font-headline mb-2">
            Properties
          </h1>
          <p className="text-muted-foreground">
            Discover premium properties across Telangana with DTCP and HMDA approvals
          </p>
        </div>

        {/* Premium Properties Promotion */}
        {!user && (
          <Card className="mb-8 bg-gradient-to-r from-purple-50 to-amber-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="flex items-center gap-3">
                  <Crown className="h-6 w-6 text-purple-600" />
                  <Lock className="h-5 w-5 text-amber-600" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-xl font-bold text-purple-900 mb-2">Premium Plots Available</h3>
                  <p className="text-purple-700 mb-3">
                    Register to access exclusive premium plots with prime locations, HMDA approvals, and high investment potential.
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start text-sm">
                    <div className="flex items-center gap-2 text-purple-600">
                      <Shield className="h-4 w-4" />
                      <span>HMDA Approved</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>High ROI</span>
                    </div>
                    <div className="flex items-center gap-2 text-purple-600">
                      <MapPin className="h-4 w-4" />
                      <span>Prime Locations</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button asChild className="bg-purple-600 hover:bg-purple-700 rounded-full">
                    <Link href="/register">Register Now</Link>
                  </Button>
                  <Button variant="outline" asChild className="rounded-full">
                    <Link href="/premium-dashboard">Learn More</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
                <option value="0-1000000">Under ₹10L</option>
                <option value="1000000-2000000">₹10L - ₹20L</option>
                <option value="2000000-5000000">₹20L - ₹50L</option>
                <option value="5000000-999999999">Above ₹50L</option>
              </select>

              <select
                value={filters.facing}
                onChange={(e) => setFilters(prev => ({ ...prev, facing: e.target.value }))}
                className="px-3 py-2 border border-primary/20 rounded-md bg-background"
              >
                <option value="all">All Facings</option>
                <option value="North">North</option>
                <option value="South">South</option>
                <option value="East">East</option>
                <option value="West">West</option>
                <option value="North-East">North-East</option>
                <option value="North-West">North-West</option>
                <option value="South-East">South-East</option>
                <option value="South-West">South-West</option>
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
            Showing {filteredPlots.length} of {plots.length} plots
          </p>
        </div>

        {/* Plots Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlots.map((plot) => (
            <Card key={plot.id} className="overflow-hidden border-primary/20 hover:shadow-lg transition-shadow">
              <div className="relative">
                <Image
                  src={plot.imageUrl || '/api/placeholder/400/300'}
                  alt={`Plot in ${plot.villageName}`}
                  width={400}
                  height={300}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 left-2">
                  <Badge className="bg-green-500 text-white">
                    <div className="flex items-center gap-1">
                      <Trees className="h-4 w-4" />
                      <span>Plot</span>
                    </div>
                  </Badge>
                </div>
                {plot.propertyType === 'Plot' && plot.plotFacing && (
                  <div className="absolute top-2 right-2">
                    <Badge className={`${getFacingColor(plot.plotFacing)} text-white`}>
                      {plot.plotFacing}
                    </Badge>
                  </div>
                )}
                {plot.status && (
                  <div className="absolute bottom-2 right-2">
                    <Badge variant={plot.status === 'Available' ? 'default' : 'secondary'}>
                      {plot.status}
                    </Badge>
                  </div>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="mb-3">
                  <h3 className="font-bold text-lg mb-1">
                    {plot.propertyNumber} - {plot.villageName}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="h-4 w-4" />
                    <span>{plot.areaName}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Ruler className="h-4 w-4" />
                    <span>{plot.propertyType === 'Plot' ? plot.plotSize : plot.propertyType === 'House' ? plot.houseSize : plot.landSize}</span>
                  </div>
                  {plot.propertyType === 'Plot' && plot.pricePerSqft && (
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-4 w-4" />
                      <span>{plot.pricePerSqft}/sqft</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      ₹{plot.price ? plot.price.toLocaleString('en-IN') : 'Price on Request'}
                    </div>
                    {plot.priceNegotiable && (
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
                  <Link href={`/property/${plot.id}`}>
                    <Button className="w-full">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredPlots.length === 0 && (
          <div className="text-center py-12">
            <Trees className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No plots found matching your filters.</p>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
