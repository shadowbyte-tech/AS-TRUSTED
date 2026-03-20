
'use client';

import { getProperties } from '@/lib/actions';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { FileUp, Pencil, Home, Users, MoreVertical, MapPin, Square, Eye, Activity, Database, Star } from 'lucide-react';
import type { Property, PropertyType, PlotFacing } from '@/lib/definitions';
import DeletePlotButton from '@/components/delete-plot-button';
import Image from 'next/image';
import { ChartContainer, ChartTooltipContent, ChartTooltip, BarChart, Bar, XAxis, YAxis } from '@/components/ui/chart';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import DBStatusIndicator from '@/components/db-status-indicator';
import { Footer } from '@/components/footer';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Client-side data fetching functions
const fetchProperties = async () => {
  try {
    const response = await fetch('/api/properties');
    if (!response.ok) throw new Error('Failed to fetch properties');
    return await response.json();
  } catch (error) {
    console.error('Error fetching properties:', error);
    return [];
  }
};

const fetchUsers = async () => {
  try {
    const response = await fetch('/api/users');
    if (!response.ok) throw new Error('Failed to fetch users');
    return await response.json();
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

const PropertyAnalyticsDashboard = dynamic(() => import('@/components/property-analytics-dashboard'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full animate-pulse bg-slate-800/50 rounded-xl" />
});

const ChartContainerDynamic = dynamic(() => import('@/components/ui/chart').then(mod => mod.ChartContainer), { ssr: false });

const chartConfig = {
  count: {
    label: 'Properties',
    color: 'hsl(var(--chart-1))',
  },
} satisfies import('@/components/ui/chart').ChartConfig;


export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const [properties, setProperties] = useState<Property[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [propertiesData, usersData] = await Promise.all([
          fetchProperties(),
          fetchUsers()
        ]);
        setProperties(Array.isArray(propertiesData) ? propertiesData : []);
        setUsers(Array.isArray(usersData) ? usersData : []);
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
        setProperties([]);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const totalProperties = Array.isArray(properties) ? properties.length : 0;
  
  // Get actual user count
  const totalUsers = Array.isArray(users) ? users.length - 1 : 0; // Exclude owner from count
  const premiumUsers = Array.isArray(users) ? users.filter(u => u.role === 'Premium').length : 0;
  const regularUsers = Array.isArray(users) ? users.filter(u => u.role === 'User').length : 0;

  const getFacingCounts = (properties: Property[]) => {
    const counts = new Map<PlotFacing, number>();
    const facings: PlotFacing[] = ['North', 'South', 'East', 'West', 'North-East', 'North-West', 'South-East', 'South-West'];
    
    facings.forEach(facing => counts.set(facing, 0));

    if (!Array.isArray(properties)) {
      return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
    }

    properties.forEach(property => {
      // Only count facing for Plot type properties
      if (property.propertyType === 'Plot' && 'plotFacing' in property) {
        counts.set(property.plotFacing, (counts.get(property.plotFacing) || 0) + 1);
      }
    });

    return Array.from(counts.entries()).map(([name, count]) => ({ name, count }));
  };

  const facingData = getFacingCounts(properties);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-gray-200 animate-pulse rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full">
      
      <div className="mx-auto w-full px-2 sm:px-4 py-4 sm:py-8">
        <div className="space-y-8">
          {/* Premium Header */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between mb-8 gap-6 text-center lg:text-left">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight font-headline bg-gradient-to-r from-primary via-accent to-accent bg-clip-text text-transparent">
                Hi Sri Swamy
              </h1>
              <p className="text-slate-300 text-base sm:text-lg font-medium mt-2">
                Welcome to your premium investment management center
              </p>
              <div className="mt-4 flex justify-center lg:justify-start">
                <DBStatusIndicator />
              </div>
            </div>
            <div className="grid grid-cols-2 lg:flex lg:flex-row gap-3 w-full lg:w-auto">
              <Button asChild variant="outline" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all shadow-xl">
                <Link href="/admin">
                  <Activity className="mr-2 h-4 w-4 text-slate-300" />
                  Site Statistics
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-white/10 backdrop-blur-md border border-white/30 hover:bg-white/20 transition-all shadow-xl">
                <Link href="/properties">
                  <Home className="mr-2 h-4 w-4 text-slate-300" />
                  View All Properties
                </Link>
              </Button>
              <Button asChild variant="outline" className="bg-gradient-to-r from-amber-500/20 to-amber-600/20 backdrop-blur-md border border-amber-500/30 hover:bg-amber-500/30 transition-all shadow-xl">
                <Link href="/properties?filter=premium">
                  <Star className="mr-2 h-4 w-4 text-amber-300" />
                  View Premium Properties
                </Link>
              </Button>
              <Button asChild className="col-span-2 lg:col-auto bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl transition-all hover:shadow-3xl">
                <Link href="/upload-property/select-type">
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload New Property
                </Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Total Plots Card */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900/50 backdrop-blur-sm">
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold text-slate-200">Total Plots</CardTitle>
                <div className="flex -space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center shadow-lg animate-pulse">
                    <div className="text-xs font-bold text-white">LIVE</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {totalProperties}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  Currently listed on platform
                </p>
              </CardContent>
            </Card>

            {/* Total Users Card */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900/50 backdrop-blur-sm">
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-bold text-slate-200">Total Users</CardTitle>
                <div className="flex -space-x-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center shadow-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-accent to-primary flex items-center justify-center shadow-lg animate-pulse">
                    <div className="text-xs font-bold text-white">PRO</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {totalUsers}
                </div>
                <p className="text-xs text-slate-400 mt-2 font-medium">
                  (Excluding owner)
                </p>
                <div className="mt-2 text-xs text-slate-400">
                  <span className="text-green-400">Premium: {premiumUsers}</span>
                  <span className="text-blue-400">Regular: {regularUsers}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Property Analytics Dashboard */}
          <div className="mb-8">
            <PropertyAnalyticsDashboard />
          </div>

          <div className="grid gap-4 sm:grid-cols-1 lg:grid-cols-1 w-full">
            {/* Plot Distribution Chart */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900/50 backdrop-blur-sm w-full">
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <BarChart className="h-4 w-4 text-white" />
                  </div>
                  Plot Distribution by Facing
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[350px] w-full p-4 relative z-10">
                <ChartContainerDynamic config={chartConfig} className="w-full h-full">
                  <BarChart accessibilityLayer data={facingData} margin={{ top: 20, right: 20, bottom: 5, left: 0 }}>
                    <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} angle={-45} textAnchor="end" height={50} interval={0} />
                    <YAxis tickLine={false} axisLine={false} tickMargin={8} allowDecimals={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="count" fill="var(--color-count)" radius={4} />
                  </BarChart>
                </ChartContainerDynamic>
              </CardContent>
            </Card>

            {/* Current Listings Card */}
            <Card className="relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900/50 backdrop-blur-sm">
              <div className="absolute left-0 right-0 top-0 bottom-0 bg-gradient-to-r from-primary/10 via-transparent to-primary/10" />
              <CardHeader className="relative z-10">
                <CardTitle>Current Listings</CardTitle>
                <CardDescription className="mt-1">
                  Manage your existing property listings with advanced controls.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {properties.length > 0 ? (
                  <>
                    {/* Mobile View */}
                    <div className="grid gap-4 sm:hidden">
                      {properties.map((property: Property) => (
                        <Card key={property.id} className="border-0 shadow-lg hover:shadow-xl transition-all">
                          <CardHeader className="flex flex-row items-start gap-4 p-4">
                            <Image
                              src={property.imageUrl || '/placeholder-property.jpg'}
                              alt={`${property.propertyType} ${property.propertyNumber}`}
                              width={80}
                              height={60}
                              className="rounded-lg object-cover aspect-[4/3]"
                              data-ai-hint={property.imageHint}
                              loading="lazy"
                            />
                            <div className="flex-1">
                              <CardTitle className="text-lg font-bold text-slate-200">{`${property.propertyType} No. ${property.propertyNumber}`}</CardTitle>
                              <div className="text-sm text-slate-400 mt-1">
                                <p className='flex items-center text-slate-300'>
                                  <MapPin className="mr-2 h-3 w-3" />
                                  {`${property.areaName}, ${property.villageName}`}
                                </p>
                                <p className='flex items-center text-slate-300 mt-1'>
                                  <Square className="mr-2 h-3 w-3" />
                                  {property.propertyType === 'Plot' && 'plotSize' in property ? property.plotSize : 
                                   property.propertyType === 'House' && 'houseSize' in property ? property.houseSize :
                                   property.propertyType === 'Land' && 'landSize' in property ? property.landSize : 'N/A'}
                                </p>
                              </div>
                            </div>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-200">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/properties/${property.id}/edit`} className="text-slate-300">Edit</Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <div className="w-full">
                                    <DeletePlotButton plotId={property.id} trigger="menuitem" />
                                  </div>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </CardHeader>
                        </Card>
                      ))}
                    </div>

                    {/* Desktop View */}
                    <Table className="hidden sm:table">
                      <TableHeader>
                        <TableRow>
                          <TableHead className="hidden sm:table-cell">Image</TableHead>
                          <TableHead>Property No.</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Location</TableHead>
                          <TableHead className="hidden md:table-cell">Facing</TableHead>
                          <TableHead className="hidden lg:table-cell">Size</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {properties.map((property: Property) => (
                          <TableRow key={property.id}>
                            <TableCell className="hidden sm:table-cell">
                              <Image
                                src={property.imageUrl || '/placeholder-property.jpg'}
                                alt={`${property.propertyType} ${property.propertyNumber}`}
                                width={64}
                                height={48}
                                className="rounded-lg object-cover"
                                data-ai-hint={property.imageHint}
                                loading="lazy"
                              />
                            </TableCell>
                            <TableCell className="font-medium text-slate-200">{property.propertyNumber}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="border-primary/30 text-primary">{property.propertyType}</Badge>
                            </TableCell>
                            <TableCell className="text-slate-300">{`${property.areaName}, ${property.villageName}`}</TableCell>
                            <TableCell className="hidden md:table-cell">
                              {property.propertyType === 'Plot' && 'plotFacing' in property ? (
                                <Badge variant="outline" className="border-primary/30 text-primary">{property.plotFacing}</Badge>
                              ) : (
                                <span className="text-slate-400">N/A</span>
                              )}
                            </TableCell>
                            <TableCell className="hidden lg:table-cell text-slate-300">
                              {property.propertyType === 'Plot' && 'plotSize' in property ? property.plotSize : 
                               property.propertyType === 'House' && 'houseSize' in property ? property.houseSize :
                               property.propertyType === 'Land' && 'landSize' in property ? property.landSize : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                              <Button asChild variant="outline" size="icon" className="text-slate-400 hover:text-slate-200">
                                <Link href={`/properties/${property.id}/edit`}>
                                  <Pencil className="h-4 w-4" />
                                  <span className="sr-only">Edit</span>
                                </Link>
                              </Button>
                              <DeletePlotButton plotId={property.id} />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </>
                ) : (
                  <div className="text-center py-16 border-2 border-dashed rounded-lg border-slate-700">
                    <Home className="mx-auto h-16 w-16 text-slate-500 mb-4" />
                    <h3 className="text-2xl font-bold text-slate-200 mb-4">No Properties Found</h3>
                    <p className="text-slate-400 mb-6">Get started by uploading your first property.</p>
                    <Button asChild className="bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-2xl">
                      <Link href="/upload">
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload New Property
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
