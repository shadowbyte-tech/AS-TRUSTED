'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Crown, 
  Star, 
  TrendingUp,
  Check,
  Shield,
  Rocket,
  Gem,
  Eye,
  Search
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import type { Property } from '@/lib/definitions';

export default function PremiumDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      return;
    }

    // Check if user has Premium or Owner role
    if (user.role !== 'Premium' && user.role !== 'Owner') {
      return;
    }

    const loadProperties = async () => {
      try {
        const response = await fetch('/api/properties');
        if (response.ok) {
          const data = await response.json();
          // Only show premium properties for premium users
          // Only show premium properties for premium users
          const premiumProperties = data.data?.filter((p: Property) => p.category === 'Premium') || [];
          setProperties(premiumProperties);
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

    loadProperties();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">Please login to access your premium dashboard.</p>
            <Button asChild>
              <Link href="/user-login">Login</Link>
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Check if user has Premium or Owner role
  if (user.role !== 'Premium' && user.role !== 'Owner') {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold">Premium Access Required</h1>
            <p className="text-muted-foreground">This dashboard is only available for Premium members.</p>
            <div className="space-y-2">
              <Button asChild>
                <Link href="/premium">Upgrade to Premium</Link>
              </Button>
              <div className="text-sm text-muted-foreground">
                Current role: {user.role}
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p>Loading premium properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <Header />
      
      <div className="flex-1">
        {/* Premium Header */}
        <div className="bg-gradient-to-r from-primary to-accent text-white">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 bg-white/20 rounded-full flex items-center justify-center border border-white/30 shadow-inner">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-bold font-headline tracking-tight uppercase">Premium Dashboard</h1>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 backdrop-blur-md px-3 font-semibold">
                  Elite Access
                </Badge>
              </div>
              
              <div className="flex flex-col items-start md:items-end gap-0.5">
                <p className="text-[10px] sm:text-xs uppercase tracking-widest opacity-70 font-black">Welcome back</p>
                <div className="flex items-center gap-2">
                  <p className="font-bold text-sm sm:text-base tracking-tight">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary">{properties.length}</div>
                <p className="text-sm text-muted-foreground">Premium Properties</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-green-600">
                  {properties.filter(p => p.status === 'Available').length}
                </div>
                <p className="text-sm text-muted-foreground">Available Now</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-blue-600">Unlimited</div>
                <p className="text-sm text-muted-foreground">Property Views</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-500/20">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-4">
                  <Crown className="h-8 w-8 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-purple-600">VIP</div>
                <p className="text-sm text-muted-foreground">Support Access</p>
              </CardContent>
            </Card>
          </div>

          {/* Premium Properties */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Crown className="h-6 w-6 text-primary" />
                Exclusive Premium Properties
              </h2>
              <Button asChild>
                <Link href="/premium-properties">
                  <Search className="h-4 w-4 mr-2" />
                  Advanced Search
                </Link>
              </Button>
            </div>

            {properties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Crown className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Premium Properties Available</h3>
                  <p className="text-muted-foreground mb-4">
                    Check back soon for new exclusive premium properties.
                  </p>
                  <Button variant="outline" asChild>
                    <Link href="/properties">Browse All Properties</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all">
                    <div className="relative">
                      <div className="h-48 w-full bg-gradient-to-r from-primary/20 to-accent/20"></div>
                      <div className="absolute top-2 left-2 flex gap-2">
                        <Badge className="bg-gradient-to-r from-primary to-accent text-white">
                          Premium
                        </Badge>
                        <Badge variant="secondary">
                          {property.status}
                        </Badge>
                      </div>
                    </div>
                    
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg">{property.propertyNumber}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property.villageName}, {property.areaName}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-primary">
                            ₹{property.price?.toLocaleString()}
                          </div>
                          <Badge variant="outline">
                            {property.propertyType}
                          </Badge>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button asChild className="flex-1">
                            <Link href={`/properties/${property.id}`}>
                              View Details
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
