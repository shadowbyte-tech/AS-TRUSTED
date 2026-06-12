'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Shield, ArrowRight, BarChart3, Rocket } from 'lucide-react';
import Link from 'next/link';

export default function ExponentialGrowthPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-purple-500/20 text-purple-600 border-purple-500/30">
                  Exponential Growth
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
                Multiply Your <span className="text-purple-600">Wealth</span> Exponentially
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                This page explains how we think about long holding periods, corridor selection, and the risks that come with any growth-oriented land purchase.
              </p>
            </div>

            <Card className="relative overflow-hidden border-purple-500/20 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10" />
              <CardHeader className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-purple-600">Compounding Power</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  Growth can happen in some corridors, but the outcome depends on infrastructure, demand, pricing, approvals, and timing. None of those variables are guaranteed.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Long</div>
                    <div className="text-sm text-muted-foreground">Investment horizon</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-600 mb-2">Corridor</div>
                    <div className="text-sm text-muted-foreground">Location strength</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">Check</div>
                    <div className="text-sm text-muted-foreground">Risk and budget fit</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-purple-500/15 bg-purple-500/5 p-4 text-sm leading-6 text-muted-foreground text-left max-w-2xl mx-auto">
                  Treat growth scenarios as examples, not promises. Always review title, access, and local development plans before making a long-term investment.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold" asChild>
                    <Link href="/premium">
                      Start Compounding
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-purple-500/30 hover:bg-purple-500/10" asChild>
                    <Link href="/properties">Find Growth Plots</Link>
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
