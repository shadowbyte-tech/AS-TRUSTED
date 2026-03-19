'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, TrendingUp, Shield, Building2, Car, Train, Users, Target } from 'lucide-react';
import Link from 'next/link';

export default function WhyKamareddy() {
  const infrastructure = [
    {
      id: 'highway',
      title: 'Highway Connectivity',
      description: 'Strategic location with excellent connectivity to major cities',
      status: 'completed',
      icon: Car,
      details: '4-lane highway expansion completed',
      impact: '30% increase in accessibility'
    },
    {
      id: 'railway',
      title: 'Railway Development',
      description: 'Proposed railway line connecting to Hyderabad',
      status: 'planned',
      icon: Train,
      details: 'Phase 1 approval received',
      impact: 'Expected 45% value appreciation'
    },
    {
      id: 'industrial',
      title: 'Industrial Growth',
      description: 'New industrial parks and manufacturing units',
      status: 'in-progress',
      icon: Building2,
      details: '2 major parks operational',
      impact: 'Employment generation'
    }
  ];

  const investmentOutlook = [
    {
      year: '2024',
      event: 'Highway expansion completed',
      impact: '30% increase in land values',
      appreciation: '₹12,000 per acre to ₹15,600 per acre'
    },
    {
      year: '2025',
      event: 'Industrial park operational',
      impact: 'Employment opportunities created',
      appreciation: '₹15,600 per acre to ₹22,000 per acre'
    },
    {
      year: '2026',
      event: 'Railway connectivity',
      impact: '45% value appreciation expected',
      appreciation: '₹22,000 per acre to ₹32,000 per acre'
    },
    {
      year: '2027',
      event: 'Smart city development',
      impact: 'Modern infrastructure available',
      appreciation: '₹32,000 per acre to ₹45,000 per acre'
    }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-emerald-500/10 via-background to-emerald-500/5">
      <div className="container px-4">
        <div className="text-center mb-16">
          <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30 mb-4">
            <MapPin className="h-3 w-3 mr-1" />
            Why Kamareddy?
          </Badge>
          <h2 className="text-4xl md:text-6xl font-black font-headline tracking-tighter">
            Strategic <span className="text-emerald-600">Location</span> Advantage
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover why Kamareddy is becoming Telangana's next investment hotspot with infrastructure development and strategic location advantages.
          </p>
        </div>

        {/* Location Overview */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-headline mb-4">Prime Location</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-emerald-500" />
                <div>
                  <p className="font-medium">Strategic Location</p>
                  <p className="text-sm text-muted-foreground">
                    Located on Nizamsagar Road, connecting Kamareddy to major cities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Growth Corridor</p>
                  <p className="text-sm text-muted-foreground">
                    Part of Hyderabad growth corridor
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="font-medium">Legal Security</p>
                  <p className="text-sm text-muted-foreground">
                    DTCP approved plots available
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold font-headline mb-4">Connectivity</h3>
            <div className="space-y-2 text-muted-600">
              <div className="flex items-center gap-2">
                <Car className="h-4 w-4" />
                <span><strong>By Road:</strong> 2 hours to Hyderabad</span>
              </div>
              <div className="flex items-center gap-2">
                <Train className="h-4 w-4" />
                <span><strong>By Rail:</strong> Proposed railway line (2026)</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span><strong>By Air:</strong> 1.5 hours to Hyderabad Airport</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <span><strong>By Bus:</strong> Regular bus services available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Infrastructure Development */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold font-headline mb-8 text-center">
            Infrastructure <span className="text-emerald-600">Development</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            {infrastructure.map((item) => (
              <div key={item.id} className="bg-white rounded-lg border border-emerald-200 p-6">
                <div className="flex items-center gap-4 mb-4">
                  <item.icon className="w-8 h-8 text-emerald-600" />
                  <div>
                    <h4 className="font-medium text-emerald-600">{item.title}</h4>
                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'completed' ? 'bg-emerald-100 text-emerald-700' : 
                    item.status === 'in-progress' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                  <span className="text-xs text-gray-500">{item.details}</span>
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium">
                  {item.impact}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Investment Outlook */}
        <div className="py-16 bg-background rounded-2xl">
          <div className="container px-4">
            <div className="text-center mb-12">
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                <TrendingUp className="h-3 w-3 mr-1" />
                Investment Outlook
              </Badge>
              <h3 className="text-3xl md:text-5xl font-bold font-headline mb-4">
                <span className="text-primary">Projected Growth</span> 2024-2027
              </h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Based on current development plans and market analysis
              </p>
            </div>

            <div className="space-y-4">
              {investmentOutlook.map((year, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{year.year}</div>
                    </div>
                    <div>
                      <p className="font-medium">{year.event}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-emerald-600">{year.impact}</p>
                    <p className="text-sm text-gray-500">{year.appreciation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h3 className="text-3xl md:text-4xl font-bold font-headline mb-4">
            Invest in <span className="text-emerald-600">Kamareddy</span> Before the Boom
          </h3>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            With infrastructure development and strategic location advantages, now is the perfect time to invest in Kamareddy land.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="h-16 px-12 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 font-black uppercase tracking-widest text-sm">
              <Link href="/properties">Browse Kamareddy Properties</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-full border-emerald-200 text-emerald-600 font-bold uppercase tracking-widest text-sm">
              <Link href="/register">Register Free</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
