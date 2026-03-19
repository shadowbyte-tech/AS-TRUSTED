'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ShieldCheck, Zap, Scale, Handshake, Globe, ArrowRight, Crown, Star, TrendingUp, Lock, Home, Users, FileText, Phone, MapPin, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import ComparisonTable from '@/components/comparison-table';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function ServicesPage() {
    const premiumServices = [
        {
            title: "Vastu Analysis",
            description: "Traditional Vastu Shastra consultation for optimal energy flow and prosperity in your property.",
            icon: Star,
            features: ["Directional analysis", "Energy optimization", "Prosperity enhancement"]
        },
        {
            title: "Market Intelligence",
            description: "In-depth market analysis and investment projections for informed property decisions.",
            icon: TrendingUp,
            features: ["ROI projections", "Market trends", "Growth analysis"]
        },
        {
            title: "Legal Assistance",
            description: "Complete legal documentation support and compliance verification for property transactions.",
            icon: Scale,
            features: ["Title verification", "Documentation", "Compliance check"]
        },
        {
            title: "Property Management",
            description: "End-to-end property management services from acquisition to maintenance and tenant relations.",
            icon: Home,
            features: ["Maintenance", "Tenant management", "Value optimization"]
        }
    ];

    const freeServices = [
        {
            title: "Property Browsing",
            description: "Browse our curated selection of verified plots with detailed information and images.",
            icon: Globe,
            link: "/properties"
        },
        {
            title: "Free Registration",
            description: "Register for free to express interest in properties and get contacted by our team.",
            icon: Users,
            link: "/register"
        },
        {
            title: "Property Inquiries",
            description: "Submit inquiries about specific properties and receive detailed information from our team.",
            icon: Handshake,
            link: "/#contact"
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-background">
            <Header />
            <main className="flex-1">
                {/* Hero Section */}
                <section className="py-24 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 flex items-center">
                    <div className="container px-4">
                        <div className="text-center space-y-8">
                            <Badge className="bg-primary/20 text-primary border-primary/30">
                                Complete Real Estate Solutions
                            </Badge>
                            <h1 className="text-5xl md:text-8xl font-black font-headline tracking-tighter leading-[0.9]">
                                AS Trusted <span className="text-primary">Consultancy</span>
                            </h1>
                            <p className="text-xl text-muted-foreground/80 leading-relaxed max-w-3xl mx-auto">
                                Your complete real estate partner offering strategic land acquisition, legal verification, 
                                market intelligence, and premium investment services for optimal property decisions.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button asChild size="lg" className="h-16 px-12 rounded-full gold-shimmer font-black uppercase tracking-widest text-sm">
                                    <Link href="/register">Get Started Free</Link>
                                </Button>
                                <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-full glass-2 border-primary/20 font-bold uppercase tracking-widest text-sm">
                                    <Link href="/properties">Browse Properties</Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Premium Services */}
                <section className="py-24 bg-background">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30 mb-4">
                                <Crown className="h-3 w-3 mr-1" />
                                Premium Services
                            </Badge>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-headline mb-4">
                                Exclusive <span className="text-amber-600">Premium</span> Features
                            </h2>
                            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                                Advanced services available after registration and premium payment via PhonePe QR code
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {premiumServices.map((service, i) => (
                                <Card key={i} className="group hover:scale-[1.02] transition-all duration-500 overflow-hidden border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
                                    <CardContent className="p-8 space-y-6">
                                        <div className="flex items-center justify-center h-16 w-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full group-hover:scale-110 transition-transform">
                                            <service.icon className="h-8 w-8 text-white" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold font-headline tracking-tight">{service.title}</h3>
                                            <p className="text-muted-foreground/70 text-sm leading-relaxed">{service.description}</p>
                                            <div className="space-y-2">
                                                {service.features.map((feature, idx) => (
                                                    <div key={idx} className="flex items-center gap-2 text-xs text-green-600">
                                                        <CheckCircle className="h-3 w-3" />
                                                        <span>{feature}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="pt-4 border-t border-amber-500/20">
                                            <p className="text-xs text-amber-600 font-medium flex items-center gap-1">
                                                <Lock className="h-3 w-3" />
                                                Premium Service
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Free Services */}
                <section className="py-24 bg-secondary/5">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <Badge className="bg-primary/20 text-primary border-primary/30 mb-4">
                                Available to Everyone
                            </Badge>
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-headline mb-4">
                                Free <span className="text-primary">Services</span>
                            </h2>
                            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                                Services available to all visitors without any payment or registration requirements
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {freeServices.map((service, i) => (
                                <Card key={i} className="group hover:scale-[1.02] transition-all duration-500 overflow-hidden">
                                    <CardContent className="p-8 space-y-6 text-center">
                                        <div className="flex items-center justify-center h-16 w-16 bg-primary/10 rounded-full group-hover:bg-primary group-hover:text-white transition-colors">
                                            <service.icon className="h-8 w-8 text-primary" />
                                        </div>
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-bold font-headline tracking-tight">{service.title}</h3>
                                            <p className="text-muted-foreground/70 text-sm leading-relaxed">{service.description}</p>
                                        </div>
                                        <Button asChild variant="outline" className="w-full rounded-full">
                                            <Link href={service.link}>
                                                Learn More
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </section>

                {/* How It Works */}
                <section className="py-24 bg-background">
                    <div className="container px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-headline mb-4">
                                How It <span className="text-primary">Works</span>
                            </h2>
                            <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                                Simple three-step process to access our complete real estate services
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center h-20 w-20 bg-primary/10 rounded-full mx-auto">
                                    <span className="text-2xl font-bold text-primary">1</span>
                                </div>
                                <h3 className="text-xl font-bold">Register Free</h3>
                                <p className="text-muted-foreground">
                                    Create your free account to browse properties and express interest in listings.
                                </p>
                            </div>

                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center h-20 w-20 bg-amber-500/10 rounded-full mx-auto">
                                    <span className="text-2xl font-bold text-amber-600">2</span>
                                </div>
                                <h3 className="text-xl font-bold">Premium Payment</h3>
                                <p className="text-muted-foreground">
                                    Pay via PhonePe QR code to unlock premium services and detailed property insights.
                                </p>
                            </div>

                            <div className="text-center space-y-6">
                                <div className="flex items-center justify-center h-20 w-20 bg-emerald-500/10 rounded-full mx-auto">
                                    <span className="text-2xl font-bold text-emerald-600">3</span>
                                </div>
                                <h3 className="text-xl font-bold">Access Premium</h3>
                                <p className="text-muted-foreground">
                                    Receive login credentials and access all premium services and exclusive property listings.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Free vs Premium Comparison */}
                <ComparisonTable />

                {/* CTA Section */}
                <section className="py-24 bg-gradient-to-r from-primary/10 to-primary/5">
                    <div className="container px-4 text-center space-y-12">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter font-headline">
                            Ready to Invest in <span className="text-accent">Premium</span> Real Estate?
                        </h2>
                        <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
                            Join thousands of satisfied investors who trust AS Trusted Consultancy for their real estate needs.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-6 justify-center">
                            <Button asChild size="lg" className="h-16 px-12 rounded-full gold-shimmer font-black uppercase tracking-widest text-sm">
                                <Link href="/register">Register Free</Link>
                            </Button>
                            <Button asChild variant="outline" size="lg" className="h-16 px-12 rounded-full glass-2 border-primary/20 font-bold uppercase tracking-widest text-sm">
                                <Link href="/properties">Browse Properties</Link>
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    );
}
