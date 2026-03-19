'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, TrendingUp, Shield, Lock, Star, Users, Home, ArrowRight, Crown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';

type Plot = {
  id: string;
  plotNumber: string;
  plotFacing: string;
  price: number;
  villageName: string;
  areaName: string;
  plotSize: string;
  imageUrl: string;
  category?: string;
};

export default function NormalPlotsPage() {
  const { user } = useAuth();
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);

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
          const plotsResponse = await response.json();
          // Filter only normal properties (non-premium) for non-authenticated users
          const filteredPlots = (plotsResponse.data || []).filter((plot: any) => 
            user || plot.category !== 'Premium'
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
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <div className="container py-12 md:py-24">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading plots...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-primary/5">
        <div className="container px-4">
          <div className="text-center mb-16">
            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
              <MapPin className="h-3 w-3 mr-1" />
              Browse Properties
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold font-headline mb-4">
              Available <span className="text-primary">Properties</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Browse our verified plots with detailed information and images. Premium features available for registered users.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <Button asChild className="rounded-full">
                <Link href="/register">
                  Register for Premium Access
                </Link>
              </Button>
              <Button asChild variant="outline" className="rounded-full">
                <Link href="/user-login">
                  Login to View Details
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Properties Promotion */}
      {!user && (
        <section className="py-12 bg-gradient-to-r from-purple-50 to-amber-50">
          <div className="container px-4">
            <Card className="max-w-4xl mx-auto border-purple-200 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="flex items-center gap-3">
                    <Crown className="h-8 w-8 text-purple-600" />
                    <Lock className="h-6 w-6 text-amber-600" />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-bold text-purple-900 mb-2">Unlock Premium Properties</h3>
                    <p className="text-purple-700 mb-4">
                      Get access to exclusive high-value properties, detailed market analysis, and priority support. Register now to unlock premium features.
                    </p>
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Star className="h-4 w-4" />
                        <span>Exclusive Properties</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <TrendingUp className="h-4 w-4" />
                        <span>Market Intelligence</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-purple-600">
                        <Shield className="h-4 w-4" />
                        <span>Legal Verification</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
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
          </div>
        </section>
      )}

      {/* Investment Highlights */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full mb-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-2">15% Annual ROI</h3>
              <p className="text-muted-foreground">Average returns on land investments</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-emerald-500/10 rounded-full mb-4">
                <Shield className="h-8 w-8 text-emerald-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">DTCP Approved</h3>
              <p className="text-muted-foreground">All plots legally verified</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 bg-amber-500/10 rounded-full mb-4">
                <Star className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-2xl font-bold mb-2">Prime Locations</h3>
              <p className="text-muted-foreground">Strategic growth corridors</p>
            </div>
          </div>
        </div>
      </section>

      {/* Plots List */}
      <section className="py-16 bg-secondary/5">
        <div className="container px-4">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
              Available Properties
            </h2>
            <p className="text-center text-muted-foreground max-w-2xl mx-auto">
              {plots.length} verified plots available in prime locations
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plots.map((plot) => (
              <div key={plot.id} className="bg-white rounded-lg border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="aspect-[16/10] relative overflow-hidden">
                  <img
                    src={plot.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000'}
                    alt={plot.plotNumber}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-emerald-500 text-white text-xs">
                      {plot.plotFacing} Facing
                    </Badge>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="text-white font-bold text-lg">
                      ₹{(plot.price || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold">{plot.villageName}</h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {plot.areaName}
                      </div>
                    </div>
                    <Badge variant="outline">
                      {plot.plotSize}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span>Legally Clear</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-blue-500" />
                      <span>High ROI</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-amber-600">
                        <Lock className="w-4 h-4" />
                        <span>Premium Features</span>
                      </div>
                      <Button asChild size="sm" className="text-xs">
                        <Link href="/register">
                          Register to Unlock
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Features CTA */}
      <section className="py-16 bg-primary/5">
        <div className="container px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Unlock Premium <span className="text-primary">Features</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Register or login to access premium features like market intelligence, legal assistance, and detailed property analysis.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="rounded-full">
              <Link href="/register">
                Register Free
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-full">
              <Link href="/user-login">
                Login
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Invest Section */}
      <section className="py-16 bg-background">
        <div className="container px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Invest in <span className="text-primary">Kamareddy</span> Land?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Strategic Location</h4>
                    <p className="text-sm text-muted-foreground">Located on Nizamsagar Road with excellent connectivity to Hyderabad</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">Infrastructure Development</h4>
                    <p className="text-sm text-muted-foreground">Highway expansion and railway connectivity driving growth</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-amber-500 rounded-full flex items-center justify-center mt-1">
                    <span className="text-white text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">High ROI Potential</h4>
                    <p className="text-sm text-muted-foreground">15% average annual returns with compound growth</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square max-w-md">
              <img
                src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                alt="Investment Opportunity"
                className="rounded-2xl object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-emerald-500/20 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
