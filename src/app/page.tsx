'use client';

import { useState, useEffect } from 'react';
import { SimpleHeader } from '@/components/simple-header';
import { Footer } from '@/components/footer';
import { MobileStickyActions } from '@/components/mobile-sticky-actions';
import HeroSection from '@/components/hero-section';
import TrustBadges from '@/components/trust-badges';
import InvestmentStats from '@/components/investment-stats';
import InvestmentZones from '@/components/investment-zones';
import MarketIntelligence from '@/components/market-intelligence';
import Testimonials from '@/components/testimonials';
import InvestmentJourney from '@/components/investment-journey';
import TelanganaMap from '@/components/telangana-map';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, TrendingUp, Shield, Crown, Star, Users, ArrowRight, CheckCircle, BarChart3, Play } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import type { Plot } from '@/lib/definitions';

export default function HomePage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [roiInput, setRoiInput] = useState('1000000');
  const [roi1yr, setRoi1yr] = useState(0);
  const [roi3yr, setRoi3yr] = useState(0);
  const [roi5yr, setRoi5yr] = useState(0);

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await fetch('/api/plots', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const plotsResponse = await response.json();
          setPlots(plotsResponse.data || []);
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

  useEffect(() => {
    const calculateROI = (principal: number, years: number, rate: number) => {
      return principal * Math.pow(1 + rate, years);
    };

    const principal = parseFloat(roiInput) || 0;
    const rate = 0.15; // 15% annual return - more realistic for land investment

    setRoi1yr(calculateROI(principal, 1, rate));
    setRoi3yr(calculateROI(principal, 3, rate));
    setRoi5yr(calculateROI(principal, 5, rate));
  }, [roiInput]);

  const featuredPlots = Array.isArray(plots) ? plots.slice(0, 3) : [];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <SimpleHeader />

      <main>
        {/* Phase 1: Institutional Authority */}
        <HeroSection />
        <TrustBadges />
        <InvestmentStats />

        {/* Phase 1.5: Real Success Story */}
        <section className="py-12 md:py-16 bg-gradient-to-r from-emerald-500/10 to-emerald-500/5">
          <div className="container px-4 text-center">
            <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 mb-4 text-xs">
              Real Success Story
            </Badge>
            <h2 className="text-2xl md:text-4xl font-bold font-headline mb-4">
              <span className="text-emerald-600">₹10L invested in Kamareddy land in 2021</span> is worth <span className="text-emerald-600">₹18L today</span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              80% ROI in just 3 years through strategic infrastructure development and location appreciation
            </p>
            <div className="flex flex-wrap justify-center gap-3 md:gap-4 mt-6">
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30 shadow-lg">
                <MapPin className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="text-xs md:text-sm font-medium text-primary">Kamareddy, Telangana</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30 shadow-lg">
                <TrendingUp className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="text-xs md:text-sm font-medium text-primary">+15% Annual ROI</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/30 shadow-lg">
                <Shield className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                <span className="text-xs md:text-sm font-medium text-primary">DTCP Approved</span>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1.6: 6 Motivational Boxes */}
        <section className="py-16 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
          <div className="container px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold font-headline mb-4">
                  Capital <span className="text-primary">Today</span>, <span className="text-accent">Tomorrow's</span> Pride
                </h2>
                <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                  Click on any motivation to discover how smart investors build lasting wealth through strategic land investments
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Box 1: Capital Today Tomorrow's Wealth */}
                <Link href="/capital-today-tomorrow" className="group">
                  <Card className="relative overflow-hidden border-primary/20 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-primary/40 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative text-center pb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-primary group-hover:text-primary/80 transition-colors">
                        Capital Strategy
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative text-center">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Strategic timing for maximum appreciation in Telangana's growth corridor
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Explore →
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Box 2: Legacy Wealth */}
                <Link href="/legacy-wealth" className="group">
                  <Card className="relative overflow-hidden border-emerald-500/20 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-emerald-500/40 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative text-center pb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-emerald-600 group-hover:text-emerald-500/80 transition-colors">
                        Legacy Building
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative text-center">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Land investments that last generations and create family heritage
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-emerald-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Build Legacy →
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Box 3: Smart Investment */}
                <Link href="/smart-investment" className="group">
                  <Card className="relative overflow-hidden border-blue-500/20 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-blue-500/40 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative text-center pb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BarChart3 className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-blue-600 group-hover:text-blue-500/80 transition-colors">
                        AI Intelligence
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative text-center">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Data-driven decisions with AI-powered market insights
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-blue-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Unlock AI →
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Box 4: Secure Future */}
                <Link href="/secure-future" className="group">
                  <Card className="relative overflow-hidden border-amber-500/20 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-amber-500/40 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative text-center pb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-amber-600 group-hover:text-amber-500/80 transition-colors">
                        Bank Security
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative text-center">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        30-point legal verification with title insurance protection
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-amber-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Secure Now →
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Box 5: Exponential Growth */}
                <Link href="/exponential-growth" className="group">
                  <Card className="relative overflow-hidden border-purple-500/20 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-purple-500/40 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative text-center pb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-purple-600 group-hover:text-purple-500/80 transition-colors">
                        3X Returns
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative text-center">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        Compounding wealth with 25% annual growth potential
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-purple-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Multiply Wealth →
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Box 6: Premium Club */}
                <Link href="/premium-club" className="group">
                  <Card className="relative overflow-hidden border-rose-500/20 h-full transition-all duration-300 hover:shadow-2xl hover:scale-105 hover:border-rose-500/40 cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-gold-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardHeader className="relative text-center pb-4">
                      <div className="h-12 w-12 bg-gradient-to-r from-rose-500 to-gold-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Crown className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="text-lg font-bold text-rose-600 group-hover:text-rose-500/80 transition-colors">
                        Elite Club
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative text-center">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        VIP access to exclusive deals and personalized advisory
                      </p>
                      <div className="mt-4 flex items-center justify-center text-xs text-rose-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        Join Elite →
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 1.75: ROI Calculator */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-8 md:mb-12">
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-4 text-xs">
                Investment Calculator
              </Badge>
              <h2 className="text-2xl md:text-4xl font-bold font-headline mb-4">
                Calculate Your <span className="text-primary">Investment Returns</span>
              </h2>
              <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
                See how your investment grows with our proven 15% annual returns
              </p>
            </div>
            
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-primary/10 to-accent/10 rounded-2xl md:rounded-3xl p-6 md:p-8 border border-primary/20 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Investment Amount (₹)</label>
                  <input 
                    type="number" 
                    placeholder="1000000" 
                    className="w-full h-12 px-4 rounded-lg border border-input bg-background text-lg font-medium"
                    id="roi-calculator-input"
                    value={roiInput}
                    onChange={(e) => setRoiInput(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="p-3 md:p-4 bg-white rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">1 Year</p>
                    <p className="text-xl md:text-2xl font-bold text-primary">₹{roi1yr.toLocaleString()}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-white rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">3 Years</p>
                    <p className="text-xl md:text-2xl font-bold text-emerald-500">₹{roi3yr.toLocaleString()}</p>
                  </div>
                  <div className="p-3 md:p-4 bg-white rounded-lg border border-border">
                    <p className="text-sm text-muted-foreground">5 Years</p>
                    <p className="text-xl md:text-2xl font-bold text-purple-500">₹{roi5yr.toLocaleString()}</p>
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">At 15% annual returns with compound growth</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Journey */}
        <section className="py-12 md:py-16 bg-background">
          <div className="container px-4">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-4xl font-bold font-headline mb-2">
                Your <span className="text-primary">Investment Journey</span>
              </h2>
              <p className="text-base text-muted-foreground max-w-xl mx-auto">
                Track your path from browsing to owning premium land — every step unlocks more value.
              </p>
            </div>
            <div className="max-w-lg mx-auto">
              <InvestmentJourney currentStep="browsed" />
            </div>
          </div>
        </section>

        {/* Phase 1.85: Real Testimonials */}
        <Testimonials />

        {/* Phase 2: Market Intelligence */}
        <InvestmentZones />
        <TelanganaMap />
        <MarketIntelligence />

        {/* Phase 3: Aerial Insights Section */}
        <section className="relative h-[40vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-primary/10 to-background">
          <div className="container relative z-10 text-center space-y-6">
            <h2 className="text-4xl md:text-6xl font-headline text-foreground drop-shadow-lg">
              Aerial Insights <br />
              <span className="text-accent italic">Infrastructure Transparency</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Get comprehensive aerial views and detailed infrastructure analysis for informed investment decisions.
            </p>
            <div className="mt-8">
              <p className="text-sm text-primary font-medium">
                🔒 Premium feature - Register and login to access detailed insights
              </p>
            </div>
          </div>
        </section>


        {/* Phase 5: Why Elite Trust */}
        <section id="about" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <div className="relative aspect-square">
                <div className="absolute inset-0 bg-primary/5 rounded-[4rem] -rotate-3" />
                <div className="absolute inset-0 bg-accent/5 rounded-[4rem] rotate-3" />
                <div className="relative h-full w-full rounded-[4rem] overflow-hidden border border-border/50 group">
                  <img
                    src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1000"
                    alt="Luxury Building"
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000"
                  />
                  <div className="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-40" />
                </div>

                <div className="absolute -bottom-10 -right-10 p-10 glass-dark rounded-[2.5rem] border border-white/10 max-w-sm hidden md:block">
                  <p className="text-white italic text-lg leading-relaxed mb-6">
                    "We don't just sell plots; we architect legacy wealth through land intelligence."
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="h-px w-12 bg-accent" />
                    <span className="text-accent text-xs font-black uppercase tracking-widest">Sri Swamy, Founder</span>
                  </div>
                </div>
              </div>

              <div className="space-y-10">
                <h2 className="text-4xl md:text-6xl font-headline tracking-tight">The AS <span className="text-primary">Trusted</span> <br /> Institutional Edge.</h2>
                <div className="space-y-8">
                  <div className="flex gap-6">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <Shield className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold font-headline">Uncompromising Verification</h4>
                      <p className="text-muted-foreground leading-relaxed">Our legal team performs a 30-year link-document verification on every listing we publish.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-accent" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold font-headline">Data-Driven Appreciation</h4>
                      <p className="text-muted-foreground leading-relaxed">We exclusive source plots in zones with upcoming infrastructure catalysts and IT expansion corridors.</p>
                    </div>
                  </div>
                  <div className="flex gap-6">
                    <div className="shrink-0 w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-7 h-7 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-xl font-bold font-headline">Strategic Site Visits</h4>
                      <p className="text-muted-foreground leading-relaxed">Experience zero-friction site visits with personalized advisor walkthroughs and layout transparency.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 bg-primary text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20" />
          <div className="container relative z-10 px-4">
            <h2 className="text-4xl md:text-7xl font-headline mb-8">Ready to <span className="text-accent">Invest</span> In <br /> Strategic Land?</h2>
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <Button size="lg" className="h-16 px-12 rounded-full bg-accent text-primary hover:bg-white transition-all font-black uppercase tracking-widest text-lg" asChild>
                <Link href="/properties">Start Browsing</Link>
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-12 rounded-full border-white/30 hover:bg-white/10 transition-all font-black uppercase tracking-widest text-lg" asChild>
                <Link href="/about">Our Strategy</Link>
              </Button>
            </div>
            
            {/* Database Management Section */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 max-w-md mx-auto">
              <h3 className="text-xl font-bold mb-4">Database Management</h3>
              <div className="space-y-3">
                <Button 
                  size="lg" 
                  className="w-full bg-white text-primary hover:bg-gray-100"
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/test-mongodb');
                      const data = await response.json();
                      alert(data.message + (data.error ? '\nError: ' + data.error : '') + (data.stats ? `\n\nUsers: ${data.stats.users}\nPlots: ${data.stats.plots}` : ''));
                    } catch (error) {
                      alert('Failed to test database connection');
                    }
                  }}
                >
                  Test MongoDB Connection
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-white/30 hover:bg-white/10 text-white"
                  onClick={async () => {
                    if (confirm('This will migrate all your JSON data to MongoDB. Continue?')) {
                      try {
                        const response = await fetch('/api/migrate-to-mongodb', { method: 'POST' });
                        const data = await response.json();
                        if (data.success) {
                          alert(`✅ Migration successful!\n\nUsers: ${data.stats.users}\nPlots: ${data.stats.plots}\nTotal Collections: ${data.stats.totalCollections}`);
                        } else {
                          alert(`❌ Migration failed: ${data.error}`);
                        }
                      } catch (error) {
                        alert('Failed to run migration');
                      }
                    }
                  }}
                >
                  Migrate Data to MongoDB
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-white/30 hover:bg-white/10 text-white"
                  asChild
                >
                  <Link href="/create-owner">
                    Create Owner Account
                  </Link>
                </Button>
                
                <Button 
                  size="lg" 
                  variant="outline"
                  className="w-full border-white/30 hover:bg-white/10 text-white"
                  asChild
                >
                  <Link href="/test-mongodb-login">
                    Test MongoDB Login
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      <MobileStickyActions />
    </div>

  );
}