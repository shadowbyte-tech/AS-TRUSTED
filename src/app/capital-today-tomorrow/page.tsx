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
                This page explains how we think about timing, corridor selection, and due diligence before a buyer decides to move forward.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-12">
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
                      Growth corridors can change quickly. We look at access roads, public infrastructure, and surrounding land use before listing a property as a possible fit.
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary font-medium">
                      <Shield className="h-4 w-4" />
                      Review approval and title status
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="relative overflow-hidden border-accent/20">
                <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-accent rounded-full flex items-center justify-center">
                      <Award className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-accent">Due Diligence</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    We review title records, access, nearby development, and practical usability so buyers can compare options with more context.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-accent font-medium">
                    <Star className="h-4 w-4" />
                    Compare locations, not slogans
                  </div>
                </CardContent>
              </Card>

              <Card className="relative overflow-hidden border-emerald-500/20">
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-primary/10" />
                <CardHeader className="relative">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Target className="h-5 w-5 text-white" />
                    </div>
                    <CardTitle className="text-emerald-600">Decision Checklist</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    Use this page as a starting point, then verify documents, visit the site, and review the neighborhood before making any purchase decision.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium">
                    <Shield className="h-4 w-4" />
                    Site visit, documents, and budget fit
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-16 border-border/60">
              <CardContent className="p-6 md:p-8 space-y-4">
                <h2 className="text-2xl font-bold">Important note</h2>
                <p className="text-muted-foreground leading-relaxed">
                  This page is informational only. Land values can rise or fall depending on demand, approvals, infrastructure, and local market conditions. No return is guaranteed.
                </p>
              </CardContent>
            </Card>

            <PremiumRegistrationForm />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
