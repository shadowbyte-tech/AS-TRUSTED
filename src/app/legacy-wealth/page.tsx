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
                This page explains how we think about land as a long-term asset, and what buyers should review before treating any plot as a family holding.
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
                  Long-term holding only makes sense when the title is clear, the location is practical, and the purchase fits your budget and time horizon.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">Docs</div>
                    <div className="text-sm text-muted-foreground">Title and approval review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">Area</div>
                    <div className="text-sm text-muted-foreground">Location and access check</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent mb-2">Horizon</div>
                    <div className="text-sm text-muted-foreground">Long-term holding fit</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/5 p-4 text-sm leading-6 text-muted-foreground text-left max-w-2xl mx-auto">
                  Important: land is not a guaranteed wealth product. Buyers should review legal documents, tax implications, and the intended holding period before making a decision.
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
