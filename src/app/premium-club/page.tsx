'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Shield, ArrowRight, Users, Gem } from 'lucide-react';
import Link from 'next/link';

export default function PremiumClubPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-rose-500/5 via-transparent to-gold-500/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-rose-500 to-gold-500 rounded-full flex items-center justify-center">
                  <Gem className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-rose-500/20 text-rose-600 border-rose-500/30">
                  Exclusive Club
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
                Join the <span className="text-rose-600">AS TRUSTED</span> <span className="text-gold-600">Premium Club</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Become part of an exclusive community of smart investors who understand that land is the ultimate wealth creation vehicle.
              </p>
            </div>

            <Card className="relative overflow-hidden border-rose-500/20 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/10 to-gold-500/10" />
              <CardHeader className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-rose-500 to-gold-500 rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-rose-600">Elite Membership Benefits</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Premium Club members get VIP treatment, exclusive deals, priority access to new plots, and personalized investment advisory services.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-rose-600 mb-2">VIP</div>
                    <div className="text-sm text-muted-foreground">Priority Access</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-gold-600 mb-2">20%</div>
                    <div className="text-sm text-muted-foreground">Exclusive Deals</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">1:1</div>
                    <div className="text-sm text-muted-foreground">Personal Advisory</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-rose-500 to-gold-500 hover:from-rose-600 hover:to-gold-600 text-white font-semibold" asChild>
                    <Link href="/premium">
                      Join Premium Club
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-rose-500/30 hover:bg-rose-500/10" asChild>
                    <Link href="/properties">Explore Benefits</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
