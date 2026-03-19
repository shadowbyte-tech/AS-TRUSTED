'use client';

import { useEffect } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import TeamProfiles from '@/components/team-profiles';
import { Users, Shield, Landmark } from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

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

                {/* Team Profiles Section */}
                <TeamProfiles />
            </main>
            <Footer />
        </div>
    );
}
