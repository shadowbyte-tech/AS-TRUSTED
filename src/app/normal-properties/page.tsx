'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Grid, 
  List, 
  SortAsc, 
  SortDesc, 
  Filter,
  Heart,
  GitCompare,
  SlidersHorizontal,
  Crown,
  Lock,
  Eye,
  Star,
  TrendingUp,
  Shield,
  Gem,
  Zap,
  Home,
  Brain,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import PropertySearchFilters from '@/components/property-search-filters';
import UnifiedPropertyList from '@/components/unified-property-list';
import { useAuth } from '@/lib/auth-context';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

import Link from 'next/link';
import type { Property, PropertyType } from '@/lib/definitions';

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

const defaultFilters: PropertyFilters = {
  searchTerm: '',
  propertyType: 'all',
  minPrice: 0,
  maxPrice: 10000000,
  minSize: 0,
  maxSize: 5000,
  village: '',
  category: 'Normal',
  status: 'all',
  amenities: [],
  plotFacing: '',
  houseType: '',
  landType: '',
  furnished: false,
  parking: false,
};

export default function NormalPropertiesPage() {
  const { user } = useAuth();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'date-desc' | 'date-asc'>('date-desc');
  const [filters, setFilters] = useState<PropertyFilters>(defaultFilters);
  const [showFilters, setShowFilters] = useState(false);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [compareList, setCompareList] = useState<string[]>([]);

  useEffect(() => {
    loadProperties();
    loadWishlist();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        // Only show Normal properties
        const normalProperties = data.data?.filter((p: Property) => p.category === 'Normal') || [];
        setProperties(normalProperties);
      } else {
        console.error('Failed to fetch properties:', response.statusText);
        setProperties([]);
      }
    } catch (error) {
      console.error('Error loading properties:', error);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  const loadWishlist = () => {
    const saved = localStorage.getItem('wishlist');
    if (saved) {
      setWishlist(JSON.parse(saved));
    }
  };

  const toggleWishlist = (propertyId: string) => {
    const newWishlist = wishlist.includes(propertyId)
      ? wishlist.filter(id => id !== propertyId)
      : [...wishlist, propertyId];
    
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  const toggleCompare = (propertyId: string) => {
    const newCompareList = compareList.includes(propertyId)
      ? compareList.filter(id => id !== propertyId)
      : [...compareList, propertyId].slice(0, 4); // Max 4 properties for comparison
    
    setCompareList(newCompareList);
  };

  const filteredAndSortedProperties = useMemo(() => {
    let filtered = properties.filter(property => {
      // Search term
      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        const matchesSearch = 
          property.villageName?.toLowerCase().includes(searchLower) ||
          property.areaName?.toLowerCase().includes(searchLower) ||
          property.description?.toLowerCase().includes(searchLower) ||
          property.propertyNumber?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Property type
      if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
        return false;
      }

      // Price range
      const price = property.price || 0;
      if (price < filters.minPrice || price > filters.maxPrice) {
        return false;
      }

      // Size range
      let size = 0;
      if (property.propertyType === 'Plot') {
        size = parseFloat(property.plotSize?.split(' ')[0] || '0');
      } else if (property.propertyType === 'House') {
        size = parseFloat(property.houseSize?.split(' ')[0] || '0');
      } else if (property.propertyType === 'Land') {
        size = parseFloat(property.landSize?.split(' ')[0] || '0');
      }
      if (size < filters.minSize || size > filters.maxSize) {
        return false;
      }

      // Village
      if (filters.village && property.villageName !== filters.village) {
        return false;
      }

      // Category - Only Normal properties
      if (property.category !== 'Normal') {
        return false;
      }

      // Status
      if (filters.status !== 'all' && property.status !== filters.status) {
        return false;
      }

      // Plot facing
      if (filters.plotFacing && property.propertyType === 'Plot' && property.plotFacing !== filters.plotFacing) {
        return false;
      }

      // House type
      if (filters.houseType && property.propertyType === 'House' && property.houseType !== filters.houseType) {
        return false;
      }

      // Land type
      if (filters.landType && property.propertyType === 'Land' && property.landType !== filters.landType) {
        return false;
      }

      // Furnished
      if (filters.furnished && property.propertyType === 'House' && !property.furnished) {
        return false;
      }

      // Parking
      if (filters.parking && property.propertyType === 'House' && !property.parking) {
        return false;
      }

      // Amenities
      if (filters.amenities.length > 0 && property.propertyType === 'House') {
        const propertyAmenities = property.amenities || [];
        const hasAllAmenities = filters.amenities.every(amenity => 
          propertyAmenities.includes(amenity)
        );
        if (!hasAllAmenities) return false;
      }

      return true;
    });

    // Sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'date-asc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'date-desc':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return sorted;
  }, [properties, filters, sortBy]);

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  const getPropertyStats = () => {
    const total = filteredAndSortedProperties.length;
    const available = filteredAndSortedProperties.filter(p => p.status === 'Available').length;
    const plots = filteredAndSortedProperties.filter(p => p.propertyType === 'Plot').length;
    const houses = filteredAndSortedProperties.filter(p => p.propertyType === 'House').length;
    const lands = filteredAndSortedProperties.filter(p => p.propertyType === 'Land').length;

    return { total, available, plots, houses, lands };
  };

  const stats = getPropertyStats();

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-64"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-zinc-900 dark:text-zinc-100">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Top Header */}
        <div className="mb-12 pt-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 mb-4 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Standard Portfolio
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter uppercase text-foreground">
            Discover Your <br />
            <span className="text-amber-500">Next Project</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl font-medium leading-relaxed">
            Verified property listings for residential and agricultural development across the region's fastest-growing sectors.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-14">
          {[
            { label: "Total Asset Count", value: stats.total, color: "text-primary", bg: "bg-primary/5" },
            { label: "Active Listings", value: stats.available, color: "text-emerald-500", bg: "bg-emerald-500/5" },
            { label: "Residential Plots", value: stats.plots, color: "text-blue-500", bg: "bg-blue-500/5" },
            { label: "Ready Houses", value: stats.houses, color: "text-purple-500", bg: "bg-purple-500/5" },
            { label: "Farm Lands", value: stats.lands, color: "text-amber-500", bg: "bg-amber-500/5" }
          ].map((stat, i) => (
            <Card key={i} className={cn("border-0 flex flex-col justify-center items-center p-6 rounded-[2rem] transition-all hover:scale-105 shadow-xl shadow-zinc-200/50 dark:shadow-none", stat.bg)}>
              <div className={cn("text-3xl font-black mb-1", stat.color)}>{stat.value}</div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground text-center line-clamp-1">{stat.label}</div>
            </Card>
          ))}
        </div>

        {/* Main Interface */}
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:w-96 flex-shrink-0">
            <div className="sticky top-28">
              <PropertySearchFilters
                filters={filters}
                onFiltersChange={setFilters}
                onReset={resetFilters}
                properties={properties}
              />
            </div>
          </div>

          <div className="flex-1 space-y-12">
            {/* Toolbar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-muted/30 p-4 rounded-[2.5rem] border border-muted/50">
               <div className="flex items-center gap-4 px-4">
                  <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center text-white font-black">
                    {filteredAndSortedProperties.length}
                  </div>
                  <div>
                    <h2 className="text-xl font-black uppercase tracking-tight">Units Available</h2>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Matching your current search</p>
                  </div>
               </div>

               <div className="flex items-center gap-4 w-full md:w-auto">
                 <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                   <SelectTrigger className="w-full md:w-56 h-12 rounded-full border-border bg-card shadow-sm font-bold">
                     <SelectValue placeholder="Ordering Strategy" />
                   </SelectTrigger>
                   <SelectContent className="rounded-2xl">
                     <SelectItem value="date-desc">Recent Listings</SelectItem>
                     <SelectItem value="date-asc">Archival Data</SelectItem>
                     <SelectItem value="price-desc">Executive Class (High)</SelectItem>
                     <SelectItem value="price-asc">Entry Value (Low)</SelectItem>
                   </SelectContent>
                 </Select>

                 <div className="flex bg-zinc-200/50 p-1 rounded-full border border-zinc-200">
                    <Button
                      size="icon"
                      variant={viewMode === 'grid' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('grid')}
                      className={cn("h-10 w-10 rounded-full transition-all", viewMode === 'grid' ? "bg-white text-primary shadow-sm" : "text-muted-foreground")}
                    >
                      <Grid className="h-5 w-5" />
                    </Button>
                    <Button
                      size="icon"
                      variant={viewMode === 'list' ? 'default' : 'ghost'}
                      onClick={() => setViewMode('list')}
                      className={cn("h-10 w-10 rounded-full transition-all", viewMode === 'list' ? "bg-white text-primary shadow-sm" : "text-muted-foreground")}
                    >
                      <List className="h-5 w-5" />
                    </Button>
                 </div>

                 <Sheet>
                    <SheetTrigger asChild>
                      <Button size="icon" className="lg:hidden h-12 w-12 rounded-full bg-primary shadow-lg shadow-primary/20">
                        <Filter className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-[320px] overflow-y-auto rounded-r-3xl">
                       <SheetHeader className="mb-8">
                         <SheetTitle className="text-2xl font-black uppercase tracking-tighter">Refine Search</SheetTitle>
                       </SheetHeader>
                       <PropertySearchFilters
                         filters={filters}
                         onFiltersChange={setFilters}
                         onReset={resetFilters}
                         properties={properties}
                       />
                    </SheetContent>
                 </Sheet>
               </div>
            </div>

            {/* Premium Upgrade Motivation - ELITE DESIGN */}
            {(!user || (user.role !== 'Premium' && user.role !== 'Owner')) && (
              <div className="relative overflow-hidden rounded-[3rem] p-[1px] group">
                <div className="absolute inset-0 bg-gradient-to-r from-amber-600 via-amber-200 to-amber-500 opacity-60 group-hover:opacity-100 transition-all duration-1000 animate-pulse"></div>
                <div className="relative bg-zinc-950 h-full w-full rounded-[2.9rem] p-8 md:p-14 flex flex-col lg:flex-row items-center justify-between gap-12 overflow-hidden shadow-2xl">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[140px] pointer-events-none" />
                  
                  <div className="relative z-10 flex-1 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4 mb-8">
                      <div className="h-14 w-14 bg-amber-500/20 rounded-2xl flex items-center justify-center border border-amber-500/40 shadow-inner">
                        <Crown className="h-7 w-7 text-amber-500" />
                      </div>
                      <div className="px-5 py-1.5 bg-amber-500 text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_0_20px_rgba(245,158,11,0.5)]">
                        Elite Tier Access
                      </div>
                    </div>
                    
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-[0.9] tracking-tighter uppercase max-w-2xl">
                      Unlock The <br />
                      <span className="bg-gradient-to-b from-amber-100 via-amber-400 to-amber-600 bg-clip-text text-transparent italic">Billionaire's Index</span>
                    </h2>
                    
                    <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-xl leading-relaxed mb-10 mx-auto lg:mx-0">
                      Standard listings just scratch the surface. Gain exclusive access to off-market inventory, AI-driven ROI multipliers, and 1-on-1 legal concierge.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12 max-w-2xl">
                      {[
                        { text: "Quantum AI Insights", icon: <Brain className="h-4 w-4" /> },
                        { text: "Off-Market Plots", icon: <Star className="h-4 w-4" /> },
                        { text: "Legal Shield Vetting", icon: <Shield className="h-4 w-4" /> },
                        { text: "VIP Site-Visit Priority", icon: <Zap className="h-4 w-4" /> }
                      ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 text-zinc-300 bg-white/5 p-4 rounded-2xl border border-white/5 group-hover:border-amber-500/20 transition-colors">
                          <div className="text-amber-500">{item.icon}</div>
                          <span className="text-xs font-black uppercase tracking-widest">{item.text}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start">
                      <Button 
                        className="w-full sm:w-auto bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-[0.2em] rounded-full h-16 px-12 transition-all hover:scale-105 shadow-[0_20px_40px_rgba(245,158,11,0.3)] text-lg flex items-center gap-4 group"
                        onClick={() => {
                          const ownerWhatsApp = "9866404090";
                          const message = "I'm ready for the ELITE PREMIUM ACCESS. Lead the way.";
                          window.open(`https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                      >
                        Elevate My Status <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform" />
                      </Button>
                      <div className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">Limited premium slots <br /> available</div>
                    </div>
                  </div>
                  
                  <div className="relative group/avatar hidden xl:block pr-10">
                    <div className="absolute inset-[-40px] bg-amber-500/10 blur-[100px] rounded-full opacity-40 animate-pulse" />
                    <div className="relative h-80 w-80 rounded-[4rem] bg-gradient-to-br from-zinc-800 to-black border-2 border-amber-500/30 flex items-center justify-center overflow-hidden group-hover:border-amber-500 transition-colors duration-700">
                      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
                      <div
                        className="relative z-10 animate-bounce"
                        style={{ animationDuration: '4s' }}
                      >
                        <Brain className="h-40 w-40 text-amber-500/70" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Properties Grid */}
            {filteredAndSortedProperties.length === 0 ? (
               <Card className="rounded-[3rem] border-dashed border-2 py-32 bg-muted/20">
                  <CardContent className="flex flex-col items-center justify-center text-center">
                    <div className="h-24 w-24 bg-muted rounded-full flex items-center justify-center mb-10">
                      <Search className="h-12 w-12 text-muted-foreground opacity-30" />
                    </div>
                    <h3 className="text-3xl font-black uppercase mb-4 tracking-tighter">No Assets Detected</h3>
                    <p className="text-muted-foreground text-lg max-w-md mb-10 font-medium">Try broadening your parameters or resetting the filters manually.</p>
                    <Button onClick={resetFilters} variant="outline" className="rounded-full h-14 px-10 font-black uppercase tracking-widest">Reload Database</Button>
                  </CardContent>
               </Card>
            ) : (
              <UnifiedPropertyList
                properties={filteredAndSortedProperties}
                viewMode={viewMode}
                showCompare={true}
                onCompareToggle={toggleCompare}
                compareList={compareList}
                onWishlistToggle={toggleWishlist}
                wishlist={wishlist}
              />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
