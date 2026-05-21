'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Lock, Star, TrendingUp, Shield, Users, Crown, BarChart3, FileText, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';

interface Feature {
  id: string;
  title: string;
  description: string;
  free: boolean;
  icon: React.ElementType;
}

const features: Feature[] = [
  {
    id: 'browse-properties',
    title: 'Browse Properties',
    description: 'View available plots with basic information',
    free: true,
    icon: MapPin
  },
  {
    id: 'property-details',
    title: 'Property Details',
    description: 'Complete plot information and specifications',
    free: true,
    icon: FileText
  },
  {
    id: 'contact-owner',
    title: 'Contact Owner',
    description: 'Submit inquiries about specific properties',
    free: true,
    icon: Phone
  },
  {
    id: 'market-intelligence',
    title: 'Market Intelligence',
    description: 'In-depth market analysis and ROI projections',
    free: false,
    icon: BarChart3
  },
  {
    id: 'vastu-analysis',
    title: 'Vastu Analysis',
    description: 'Traditional Vastu consultation and energy optimization',
    free: false,
    icon: Star
  },
  {
    id: 'legal-assistance',
    title: 'Legal Assistance',
    description: 'Complete legal documentation and compliance verification',
    free: false,
    icon: Shield
  },
  {
    id: 'property-management',
    title: 'Property Management',
    description: 'End-to-end property management and maintenance',
    free: false,
    icon: Users
  },
  {
    id: 'premium-plots',
    title: 'Premium Plots Access',
    description: 'Exclusive high-value investment opportunities',
    free: false,
    icon: Crown
  },
  {
    id: 'roi-projections',
    title: 'ROI Projections',
    description: 'Detailed investment growth projections',
    free: false,
    icon: TrendingUp
  },
  {
    id: 'priority-support',
    title: 'Priority Support',
    description: '24/7 dedicated customer support',
    free: false,
    icon: Phone
  }
];

export default function ComparisonTable() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000')] bg-cover bg-center opacity-10"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-amber-900/20"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-slate-900 via-transparent to-slate-900"></div>
      
      {/* Premium Floating Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-2xl animate-pulse delay-500"></div>
      
      <div className="container px-4 relative z-10">
        <div className="text-center mb-16">
          <Badge className="bg-gradient-to-r from-purple-500/20 to-amber-500/20 text-purple-200 border-purple-500/30 mb-4 backdrop-blur-sm">
            <Users className="h-3 w-3 mr-1" />
            Compare Plans
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter mb-4">
            Free vs <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">Premium</span>
          </h2>
          <p className="text-xl text-purple-200/80 max-w-3xl mx-auto">
            See exactly what you get with our premium membership. Upgrade to unlock exclusive features and maximize your investment returns.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Free Plan */}
          <Card className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-emerald-500/10 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-emerald-500/30 via-transparent to-emerald-500/30"></div>
            
            <CardHeader className="text-center pb-4 relative z-10">
              <CardTitle className="text-2xl font-bold text-emerald-400">Free Plan</CardTitle>
              <p className="text-emerald-200/80">Start your investment journey</p>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="text-center">
                <div className="text-4xl font-bold text-emerald-300">₹0</div>
                <p className="text-sm text-emerald-200/60">Forever free</p>
              </div>
              
              <div className="space-y-4">
                {features.map((feature) => (
                  <div 
                    key={feature.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      feature.free 
                        ? 'bg-emerald-500/10 border border-emerald-500/30' 
                        : 'bg-white/5 border border-white/10'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {feature.free ? (
                        <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="m9 12 2 2 4-4" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                          <Lock className="w-3 h-3 text-white/60" strokeWidth="2"/>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        feature.free ? 'text-emerald-200' : 'text-white/60'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${
                        feature.free ? 'text-emerald-200/60' : 'text-white/40'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-6">
                <Button asChild variant="outline" size="lg" className="w-full h-16 px-12 rounded-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/50 transition-all font-bold uppercase tracking-widest text-sm">
                  <Link href="/user-login">
                    Get Started Free
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Premium Plan */}
          <Card className="relative bg-gradient-to-br from-purple-500/20 to-amber-500/20 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 overflow-hidden">
            {/* Premium Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-transparent to-amber-500/20 pointer-events-none"></div>
            <div className="absolute inset-0 rounded-3xl border border-gradient-to-r from-purple-500/50 via-transparent to-amber-500/50"></div>
            
            <div className="absolute top-4 right-4 relative z-10">
              <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 text-white border-amber-600 px-3 py-1 backdrop-blur-sm">
                <Crown className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
            
            <CardHeader className="text-center pb-4 relative z-10">
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">Premium Plan</CardTitle>
              <p className="text-purple-200/80">Unlock your investment potential</p>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="text-center">
                <div className="text-4xl font-black bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">₹500</div>
                <div className="text-sm text-zinc-400 mt-2 font-medium">One-time payment</div>
                <p className="text-xs text-amber-400 font-medium">15% average ROI achieved</p>
              </div>
              
              <div className="space-y-4">
                {features.map((feature) => (
                  <div 
                    key={feature.id}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      feature.free 
                        ? 'bg-white/10 border border-white/20' 
                        : 'bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-500/30'
                    }`}
                    onMouseEnter={() => setHoveredFeature(feature.id)}
                    onMouseLeave={() => setHoveredFeature(null)}
                  >
                    <div className="flex-shrink-0">
                      {feature.free ? (
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white/60" strokeWidth="2"/>
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-r from-purple-500 to-amber-500 flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" strokeWidth="2"/>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className={`font-medium ${
                        feature.free ? 'text-white/60' : 'text-purple-200 font-bold'
                      }`}>
                        {feature.title}
                      </h4>
                      <p className={`text-sm ${
                        feature.free ? 'text-white/40' : 'text-purple-200/60'
                      }`}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center pt-6">
                <Button 
                  size="lg" 
                  className="w-full h-16 px-12 rounded-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all font-bold uppercase tracking-widest text-sm border-0"
                  onClick={() => {
                    const ownerWhatsApp = "9866404090";
                    const message = "I am interested to access premium. Send me the QR code of your payment process.";
                    const whatsappURL = `https://wa.me/${ownerWhatsApp.replace('+', '')}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappURL, '_blank');
                  }}
                >
                  Upgrade to Premium
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center py-16">
          <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Ready to Invest in <span className="text-purple-400">Premium</span> Real Estate?
          </h2>
          <p className="text-lg text-purple-200/80 max-w-2xl mx-auto mb-8">
            Join our exclusive network of HNI investors and access premium investment opportunities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-12 rounded-full gold-shimmer font-black uppercase tracking-widest text-sm">
              <Link href="/register">Get Started Free</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-full glass-2 border-purple-500/30 font-bold uppercase tracking-widest text-sm text-purple-400 hover:text-purple-300">
              <Link href="/properties">Browse Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
                            
