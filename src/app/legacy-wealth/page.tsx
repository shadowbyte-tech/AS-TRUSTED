'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Shield, ArrowRight, Building, TreePine } from 'lucide-react';
import Link from 'next/link';

export default function LegacyWealthPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-emerald-500/5 via-transparent to-primary/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-emerald-500 to-primary rounded-full flex items-center justify-center">
                  <TreePine className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-600 border-emerald-500/30">
                  Legacy Building
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
                Build Your <span className="text-emerald-600">Legacy</span> Today
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Land is the only investment that truly lasts generations. Every plot you buy today becomes your family's heritage tomorrow.
              </p>
            </div>

            <Card className="relative overflow-hidden border-emerald-500/20 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-primary/10" />
              <CardHeader className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-emerald-500 to-primary rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-emerald-600">Secure Your Family's Future</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Premium members get access to heritage plots with clear titles, strategic locations, and exponential growth potential. Don't just buy land—invest in generations.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">100%</div>
                    <div className="text-sm text-muted-foreground">Clear Titles</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">3x</div>
                    <div className="text-sm text-muted-foreground">Faster Appreciation</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">∞</div>
                    <div className="text-sm text-muted-foreground">Generational Value</div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-emerald-500 to-primary hover:from-emerald-600 hover:to-primary/90 text-white font-semibold" asChild>
                    <Link href="/premium">
                      Build Your Legacy
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-emerald-500/30 hover:bg-emerald-500/10" asChild>
                    <Link href="/properties">View Heritage Plots</Link>
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
