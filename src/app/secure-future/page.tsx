'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Shield, ArrowRight, Lock, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function SecureFuturePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-amber-500/5 via-transparent to-orange-500/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                  <Lock className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                  Secure Investment
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
                Lock Your <span className="text-amber-600">Financial Future</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                This page explains the legal checks and ownership review steps we use before a property is presented as a lower-risk option.
              </p>
            </div>

            <Card className="relative overflow-hidden border-amber-500/20 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10" />
              <CardHeader className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-amber-600">Bank-Grade Security</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  We review documents, site access, and available approvals so buyers can make a more informed decision. No property should be treated as risk-free.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-amber-600 mb-2">Docs</div>
                    <div className="text-sm text-muted-foreground">Title review</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-orange-600 mb-2">Site</div>
                    <div className="text-sm text-muted-foreground">Physical inspection</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">Risk</div>
                    <div className="text-sm text-muted-foreground">Buyer evaluation</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-amber-500/15 bg-amber-500/5 p-4 text-sm leading-6 text-muted-foreground text-left max-w-2xl mx-auto">
                  Security in real estate comes from careful review, not guarantees. Please verify legal documents and consult qualified professionals before purchase.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold" asChild>
                    <Link href="/premium">
                      Secure Your Investment
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-amber-500/30 hover:bg-amber-500/10" asChild>
                    <Link href="/properties">View Secured Plots</Link>
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
