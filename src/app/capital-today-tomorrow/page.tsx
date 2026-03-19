'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Crown, Star, Shield, ArrowRight, Target, Award } from 'lucide-react';
import Link from 'next/link';
import PremiumRegistrationForm from '@/components/premium-registration-form';

export default function CapitalTodayTomorrowPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-primary/20 text-primary border-primary/30">
                  Investment Philosophy
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
                Build Your <span className="text-primary">Future</span> Today
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Every smart decision today compounds into tomorrow's fortune. Don't wait for the future—create it now with strategic land investments that appreciate exponentially.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="space-y-8">
                <Card className="relative overflow-hidden border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10" />
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-primary rounded-full flex items-center justify-center">
                        <Target className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-primary">Strategic Timing</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      The best time to invest in Telangana's growth corridor is now. Infrastructure projects, IT expansions, and urban development are creating unprecedented appreciation opportunities.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Shield className="h-4 w-4" />
                      DTCP Approved Plots
                    </div>
                  </CardContent>
                </Card>

                <Card className="relative overflow-hidden border-accent/20">
                  <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10" />
                  <CardHeader className="relative">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-accent">Proven Returns</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="relative space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      Historical data shows 15-20% annual returns in strategic locations. Our clients who invested 3 years ago are now sitting on 80% appreciation.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-accent font-medium">
                      <Star className="h-4 w-4" />
                      80% Average ROI
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <PremiumRegistrationForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
