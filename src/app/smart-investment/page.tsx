'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Shield, ArrowRight, Brain, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export default function SmartInvestmentPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      
      <main className="flex-1">
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5">
          <div className="container px-4">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <div className="inline-flex items-center gap-3 mb-6">
                <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <Badge className="bg-blue-500/20 text-blue-600 border-blue-500/30">
                  Smart Investment
                </Badge>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-headline mb-6">
                Invest with <span className="text-blue-600">Intelligence</span>, Not Emotion
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                This page explains the type of market information we review before suggesting a property, including location, access, approvals, and practical demand.
              </p>
            </div>

            <Card className="relative overflow-hidden border-blue-500/20 max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10" />
              <CardHeader className="relative text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  <div className="h-16 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Crown className="h-8 w-8 text-white" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-blue-600">AI-Powered Investment Intelligence</CardTitle>
              </CardHeader>
              <CardContent className="relative text-center space-y-6">
                <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                  We use data as a decision aid, not as a promise. Final choices still depend on site visits, document checks, and your own investment goals.
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">Map</div>
                    <div className="text-sm text-muted-foreground">Location context</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">Docs</div>
                    <div className="text-sm text-muted-foreground">Approval checks</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600 mb-2">Trend</div>
                    <div className="text-sm text-muted-foreground">Market direction</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-500/15 bg-blue-500/5 p-4 text-sm leading-6 text-muted-foreground text-left max-w-2xl mx-auto">
                  AI and analytics can highlight patterns, but they do not guarantee future returns. Treat the output as a research aid, not a substitute for due diligence.
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold" asChild>
                    <Link href="/premium">
                      Unlock AI Insights
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-blue-500/30 hover:bg-blue-500/10" asChild>
                    <Link href="/ai-dashboard">Try AI Demo</Link>
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
