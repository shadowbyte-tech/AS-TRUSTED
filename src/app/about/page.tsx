'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import TeamProfiles from '@/components/team-profiles';
import { Users, Shield, Landmark, CheckCircle2, MapPinned, FileCheck2, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
                <section className="py-24 relative overflow-hidden bg-background">
                    <div className="container px-4">
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                            <div className="space-y-6 lg:space-y-10">
                                <div className="inline-flex items-center px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-[10px] lg:text-[10px] font-black uppercase tracking-widest text-primary">
                                    Our Elite Legacy
                                </div>
                                <h1 className="text-3xl lg:text-5xl md:text-6xl font-black font-headline tracking-tighter leading-[0.9]">
                                    Integrity Over <br />
                                    <span className="text-primary">Everything.</span>
                                </h1>
                                <p className="text-lg lg:text-xl text-muted-foreground/80 leading-relaxed">
                                    Founded by Sri Swamy, AS Trusted Consultancy was born out of a single observation: real estate world needed a gold standard for integrity.
                                </p>
                                <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 pt-6">
                                    <div className="space-y-2">
                                        <div className="h-12 w-12 rounded-xl glass-dark-2 flex items-center justify-center text-primary">
                                            <Users className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-bold font-headline pt-2 text-lg lg:text-xl">1,200+ HNI Clients</h4>
                                        <p className="text-sm text-muted-foreground/70">A global network of elite investors trust our strategic vision.</p>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="h-12 w-12 rounded-xl glass-dark-2 flex items-center justify-center text-accent">
                                            <Shield className="h-6 w-6" />
                                        </div>
                                        <h4 className="font-bold font-headline pt-2 text-lg lg:text-xl">Zero Red Tape</h4>
                                        <p className="text-sm text-muted-foreground/70">We handle complex legal frameworks so you don't have to.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute -inset-5 lg:-inset-10 bg-primary/10 rounded-full blur-[50px] animate-float" />
                                <div className="relative aspect-square rounded-[3rem] lg:rounded-[4rem] glass-dark-2 border-white/10 overflow-hidden flex items-center justify-center p-8 lg:p-12 text-center">
                                    <div className="space-y-4 lg:space-y-6">
                                        <Landmark className="h-16 lg:h-24 w-16 lg:w-24 mx-auto text-primary opacity-20" />
                                        <h3 className="text-2xl lg:text-3xl font-black font-headline italic">"Every square foot we consult on is treated as if it were for our own family legacy."</h3>
                                        <p className="text-accent font-black uppercase tracking-[0.3em] text-[10px] lg:text-xs">Sri Swamy — Founder</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-20 bg-muted/20">
                    <div className="container px-4">
                        <div className="mx-auto max-w-5xl space-y-8">
                            <div className="text-center space-y-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/20 bg-gold/5 text-xs font-bold uppercase tracking-widest text-gold">
                                    <FileCheck2 className="h-3.5 w-3.5" />
                                    What We Verify
                                </div>
                                <h2 className="text-3xl md:text-5xl font-black font-headline tracking-tight">
                                    A real trust process, not a marketing line
                                </h2>
                                <p className="max-w-3xl mx-auto text-muted-foreground leading-relaxed">
                                    Buyers need more than promises. We publish content that explains approvals, location context, and the steps we take before a property is shown to the public.
                                </p>
                            </div>

                            <div className="grid gap-6 md:grid-cols-3">
                                {[
                                    {
                                        icon: Shield,
                                        title: 'Legal review',
                                        text: 'We look at title documents, approval status, and ownership context before a property is listed.',
                                    },
                                    {
                                        icon: MapPinned,
                                        title: 'Location research',
                                        text: 'We check access roads, nearby development, and corridor relevance so buyers understand the real setting.',
                                    },
                                    {
                                        icon: CheckCircle2,
                                        title: 'Buyer guidance',
                                        text: 'We explain risks, paperwork, and next steps in simple language so first-time investors can decide confidently.',
                                    },
                                ].map((item) => (
                                    <Card key={item.title} className="border-border/60 bg-card/80">
                                        <CardContent className="p-6 space-y-4">
                                            <div className="h-12 w-12 rounded-2xl bg-gold/10 flex items-center justify-center text-gold">
                                                <item.icon className="h-6 w-6" />
                                            </div>
                                            <h3 className="text-xl font-bold">{item.title}</h3>
                                            <p className="text-sm leading-6 text-muted-foreground">{item.text}</p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl border border-gold/15 bg-gradient-to-r from-gold/5 via-background to-background p-6 md:p-8">
                                <div className="text-center md:text-left">
                                    <h3 className="text-2xl font-bold">Need a more detailed company overview?</h3>
                                    <p className="mt-2 text-sm text-muted-foreground max-w-2xl">
                                        Our Trust Center explains how we review listings, keep utility and portal pages out of search indexing, and maintain a cleaner public site for visitors.
                                    </p>
                                </div>
                                <Button asChild className="h-12 rounded-full bg-gold px-6 font-bold text-black hover:bg-gold-light">
                                    <Link href="/trust-center" className="flex items-center gap-2">
                                        Visit Trust Center
                                        <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Team Profiles Section */}
                <TeamProfiles />
            </main>
            <Footer />
        </div>
    );
}
