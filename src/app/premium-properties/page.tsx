'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Crown, Brain, Activity, Calculator, Bot, Bell, Grid, List, SortAsc, SortDesc } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Property } from '@/lib/definitions';
import dynamic from 'next/dynamic';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import UnifiedPropertyList from '@/components/unified-property-list';
import PropertySearchFilters from '@/components/property-search-filters';
import PropertyAIAdvisor from '@/components/property-ai-advisor';
import { cn } from '@/lib/utils';

// Dynamic imports for performance
const AIDecisionEngine = dynamic(
  () => import('@/components/ai-decision-engine').then(mod => ({ default: mod.AIDecisionEngine })),
  { 
    loading: () => <div className="h-64 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const LiveInfrastructureIntelligence = dynamic(
  () => import('@/components/live-infrastructure-intelligence').then(mod => ({ default: mod.LiveInfrastructureIntelligence })),
  { 
    loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const SmartROISimulation = dynamic(
  () => import('@/components/smart-roi-simulation').then(mod => ({ default: mod.SmartROISimulation })),
  { 
    loading: () => <div className="h-56 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const PersonalAIAdvisor = dynamic(
  () => import('@/components/personal-ai-advisor').then(mod => ({ default: mod.PersonalAIAdvisor })),
  { 
    loading: () => <div className="h-48 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

const RealTimeOpportunityAlerts = dynamic(
  () => import('@/components/real-time-opportunity-alerts').then(mod => ({ default: mod.RealTimeOpportunityAlerts })),
  { 
    loading: () => <div className="h-32 bg-gray-100 animate-pulse rounded-lg" />,
    ssr: false 
  }
);

// Inline PropertySearchFilters component since the external one doesn't exist
// Removed local PropertySearchFilters to use the shared one from components/property-search-filters

interface PropertyFilters {
  location: string;
  priceRange: string;
  propertyType: string;
  category: string;
  status: string;
  amenities: string[];
  plotSize?: string;
  bedrooms?: string;
}

const mockProperties: Property[] = [
  {
    id: '1',
    propertyNumber: 'PROP001',
    propertyType: 'House',
    villageName: 'Kamareddy',
    areaName: 'Main Road',
    imageUrl: '/images/property1.jpg',
    imageHint: 'Premium Villa',
    description: 'Luxurious 3BHK villa with modern amenities',
    price: 7500000,
    priceNegotiable: false,
    status: 'Available',
    category: 'Premium',
    houseSize: '2400 sqft',
    bedrooms: 3,
    bathrooms: 2,
    floors: 2,
    houseType: 'Independent',
    furnished: true,
    parking: true,
    amenities: ['Swimming Pool', 'Gym', 'Garden'],
    yearBuilt: 2020,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    id: '2',
    propertyNumber: 'PROP002',
    propertyType: 'Plot',
    villageName: 'Hyderabad',
    areaName: 'Gachibowli',
    imageUrl: '/images/property2.jpg',
    imageHint: 'Commercial Plot',
    description: 'Prime commercial plot in IT corridor',
    price: 12000000,
    priceNegotiable: true,
    status: 'Available',
    category: 'Premium',
    plotNumber: 'PLOT002',
    plotSize: '500 sqft',
    plotFacing: 'North',
    pricePerSqft: 24000,
    createdAt: '2024-01-14',
    updatedAt: '2024-01-14'
  },
  {
    id: '3',
    propertyNumber: 'PROP003',
    propertyType: 'House',
    villageName: 'Hyderabad',
    areaName: 'Banjara Hills',
    imageUrl: '/images/property3.jpg',
    imageHint: 'Luxury Apartment',
    description: 'Premium 4BHK apartment with city view',
    price: 9500000,
    priceNegotiable: false,
    status: 'Available',
    category: 'Premium',
    houseSize: '1800 sqft',
    bedrooms: 4,
    bathrooms: 3,
    floors: 1,
    houseType: 'Apartment',
    furnished: true,
    parking: true,
    amenities: ['Power Backup', 'Security', 'Club House'],
    yearBuilt: 2022,
    createdAt: '2024-01-13',
    updatedAt: '2024-01-13'
  }
];

export default function PremiumPropertiesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [activeTab, setActiveTab] = useState('properties');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('date-desc');
  const [filters, setFilters] = useState<any>({
    searchTerm: '',
    propertyType: 'all',
    minPrice: 0,
    maxPrice: 10000000,
    minSize: 0,
    maxSize: 5000,
    village: '',
    category: 'Premium',
    status: 'all',
    amenities: [],
    plotFacing: '',
    houseType: '',
    landType: '',
    furnished: false,
    parking: false,
  });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'Premium' && user.role !== 'Owner'))) {
      router.push('/user-login');
      return;
    }

    fetchProperties();
  }, [user, isLoading, router]);

  useEffect(() => {
    filterAndSortProperties();
  }, [properties, filters, sortBy]);

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties');
      if (response.ok) {
        const data = await response.json();
        // Assuming data is { data: Property[], ... }
        const allProps = data.data || [];
        // Owners can see Premium category properties
        const premiumOnly = allProps.filter((p: any) => p.category === 'Premium');
        setProperties(premiumOnly);
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch properties',
      });
    } finally {
      setDataLoading(false);
    }
  };

  const filterAndSortProperties = () => {
    let filtered = properties.filter(property => {
      if (filters.searchTerm && !property.villageName.toLowerCase().includes(filters.searchTerm.toLowerCase()) && !property.areaName.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
        return false;
      }
      if (property.price && (property.price < filters.minPrice || property.price > filters.maxPrice)) {
        return false;
      }
      if (filters.propertyType !== 'all' && property.propertyType !== filters.propertyType) {
        return false;
      }
      return true;
    });

    // Sort properties
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return (a.price || 0) - (b.price || 0);
        case 'price-desc':
          return (b.price || 0) - (a.price || 0);
        case 'date-desc':
          return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
        case 'date-asc':
          return new Date(a.createdAt || '').getTime() - new Date(b.createdAt || '').getTime();
        default:
          return 0;
      }
    });

    setFilteredProperties(filtered);
  };

  const resetFilters = () => {
    setFilters({
      location: '',
      priceRange: '',
      propertyType: '',
      category: '',
      status: '',
      amenities: [],
    });
  };

  if (isLoading || dataLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main>
        {/* Premium Access Banner */}
        <section className="py-8 bg-gradient-to-r from-amber-500/10 via-transparent to-orange-500/5">
          <div className="container px-4 mt-8 md:mt-0">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <div className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                        <Crown className="h-3 w-3 mr-1" />
                        Premium Elite
                      </Badge>
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Welcome back</p>
                    </div>
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-black font-headline tracking-tighter text-foreground mb-1 uppercase">
                      Premium Real Estate, <span className="text-amber-500">{user?.name || user?.email?.split('@')[0]}</span>
                    </h1>
                    <p className="text-sm font-bold text-muted-foreground tracking-tight">
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Premium Features Navigation */}
        <section className="py-4 border-b bg-background/95 backdrop-blur sticky top-20 z-40 overflow-x-auto no-scrollbar">
          <div className="container px-4 min-w-max md:min-w-0">
            <div className="flex items-center gap-2">
              <Button
                variant={activeTab === 'properties' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('properties')}
                className="flex items-center gap-2 rounded-full h-9"
              >
                <Grid className="h-4 w-4" />
                Properties
              </Button>
              <Button
                variant={activeTab === 'ai-analysis' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('ai-analysis')}
                className="flex items-center gap-2 rounded-full h-9"
                disabled={!selectedProperty}
              >
                <Brain className="h-4 w-4" />
                AI Analysis
              </Button>
              <Button
                variant={activeTab === 'infrastructure' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('infrastructure')}
                className="flex items-center gap-2 rounded-full h-9"
              >
                <Activity className="h-4 w-4" />
                Infrastructure
              </Button>
              <Button
                variant={activeTab === 'roi-simulation' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('roi-simulation')}
                className="flex items-center gap-2 rounded-full h-9"
                disabled={!selectedProperty}
              >
                <Calculator className="h-4 w-4" />
                ROI Simulator
              </Button>
              <Button
                variant={activeTab === 'ai-advisor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('ai-advisor')}
                className="flex items-center gap-2 rounded-full h-9"
              >
                <Bot className="h-4 w-4" />
                AI Advisor
              </Button>
              <Button
                variant={activeTab === 'opportunity-alerts' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setActiveTab('opportunity-alerts')}
                className="flex items-center gap-2 rounded-full h-9"
              >
                <Bell className="h-4 w-4" />
                Opportunity Alerts
              </Button>
            </div>
          </div>
        </section>

        {/* AI Features Content */}
        {activeTab === 'ai-analysis' && selectedProperty && (
          <section className="py-8">
            <div className="container px-4">
              <AIDecisionEngine property={selectedProperty} />
            </div>
          </section>
        )}

        {activeTab === 'infrastructure' && (
          <section className="py-8">
            <div className="container px-4">
              <LiveInfrastructureIntelligence 
                propertyLocation={selectedProperty?.villageName || 'Kamareddy'} 
                propertyId={selectedProperty?.id || 'default'} 
              />
            </div>
          </section>
        )}

        {activeTab === 'roi-simulation' && selectedProperty && (
          <section className="py-8">
            <div className="container px-4">
              <SmartROISimulation 
                propertyPrice={selectedProperty.price || 5000000}
                propertyLocation={selectedProperty.villageName || 'Kamareddy'}
              />
            </div>
          </section>
        )}

        {activeTab === 'ai-advisor' && (
          <section className="py-8">
            <div className="container px-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">AI Advisor</h3>
                <p className="text-muted-foreground">Personal AI property advisor coming soon!</p>
              </div>
            </div>
          </section>
        )}

        {activeTab === 'opportunity-alerts' && (
          <section className="py-8">
            <div className="container px-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Opportunity Alerts</h3>
                <p className="text-muted-foreground">Real-time opportunity alerts coming soon!</p>
              </div>
            </div>
          </section>
        )}

        {/* Properties List */}
        {activeTab === 'properties' && (
          <section className="py-8 bg-background">
            <div className="container px-4">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Desktop Filters Sidebar */}
                <div className="hidden lg:block lg:w-80 flex-shrink-0">
                  <div className="sticky top-40">
                    <PropertySearchFilters
                      filters={filters}
                      onFiltersChange={setFilters}
                      onReset={resetFilters}
                      properties={properties}
                    />
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-1">
                  {/* Toolbar */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <div className="flex items-center justify-between w-full sm:w-auto">
                      <h2 className="text-xl font-bold font-headline">
                        {filteredProperties.length} Premium Options
                      </h2>
                      
                      {/* Mobile Filter Trigger */}
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="outline" size="sm" className="lg:hidden h-9 rounded-full px-4 border-amber-500/30 text-amber-600">
                            <Activity className="h-4 w-4 mr-2" />
                            Filters
                          </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="w-[300px] sm:w-[400px] overflow-y-auto">
                          <SheetHeader className="mb-6">
                            <SheetTitle>Property Filters</SheetTitle>
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
                    
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                        <SelectTrigger className="w-full sm:w-48 h-10 rounded-full border-white/10 bg-slate-900/50">
                          <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date-desc">Newest First</SelectItem>
                          <SelectItem value="date-asc">Oldest First</SelectItem>
                          <SelectItem value="price-desc">Highest Price</SelectItem>
                          <SelectItem value="price-asc">Lowest Price</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <div className="flex bg-slate-900/50 rounded-full p-1 border border-white/5">
                        <Button
                          size="sm"
                          variant={viewMode === 'grid' ? 'default' : 'ghost'}
                          onClick={() => setViewMode('grid')}
                          className={cn("h-8 w-8 p-0 rounded-full", viewMode === 'grid' && "bg-primary shadow-lg")}
                        >
                          <Grid className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={viewMode === 'list' ? 'default' : 'ghost'}
                          onClick={() => setViewMode('list')}
                          className={cn("h-8 w-8 p-0 rounded-full", viewMode === 'list' && "bg-primary shadow-lg")}
                        >
                          <List className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Properties Display */}
                  {filteredProperties.length > 0 ? (
                    <UnifiedPropertyList
                      properties={filteredProperties}
                      viewMode={viewMode}
                      showCompare={true}
                    />
                  ) : (
                    <div className="text-center py-20 bg-slate-900/10 rounded-3xl border border-dashed border-white/10">
                      <div className="h-20 w-20 bg-slate-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Grid className="h-10 w-10 text-muted-foreground opacity-20" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">No Premium Properties Found</h3>
                      <p className="text-muted-foreground mb-8">Try adjusting your filters to find more properties.</p>
                      <Button onClick={resetFilters} className="rounded-full">Clear Filters</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Property AI Advisor Section */}
        <section className="py-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto">
              <PropertyAIAdvisor property={{
                id: 'sample',
                propertyType: 'Plot',
                location: 'Kamareddy',
                villageName: 'Kamareddy',
                price: 1000000,
                plotSize: 200,
                category: 'Premium',
                status: 'Available',
                description: 'Sample property for AI analysis',
                amenities: [],
                imageUrl: '',
                createdAt: new Date(),
                updatedAt: new Date()
              }} />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
