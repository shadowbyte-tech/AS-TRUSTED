'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Zap, Compass, Building2, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth-context';

interface ROISidebarProps {
    plot: any;
}

export default function ROISidebar({ plot }: ROISidebarProps) {
    const { user } = useAuth();

    const banks = [
        { name: 'HDFC', logo: '🏦' },
        { name: 'SBI', logo: '🏛️' },
        { name: 'ICICI', logo: '🏛️' },
    ];

    // For non-authenticated users or regular users, only show banking section
    if (!user || (user.role !== 'Premium' && user.role !== 'Owner')) {
        return (
            <aside className="space-y-8">
                {/* Banking Section - Always visible */}
                <div className="px-4 py-8 rounded-[2rem] bg-secondary/5 border border-white/5 space-y-6">
                    <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
                        Authorized Lending Partners
                    </p>
                    <div className="flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {banks.map(bank => (
                            <div key={bank.name} className="flex flex-col items-center gap-2">
                                <span className="text-2xl">{bank.logo}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{bank.name}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </aside>
        );
    }

    // For Premium users and Owners, show all premium content
    const projections = [
        { label: 'Current Value', value: '₹4.2 Cr', trend: '+12%' },
        { label: '2026 Projection', value: '₹5.8 Cr', trend: '+38%' },
        { label: 'Infrastructure Yield', value: 'High', trend: 'A+' },
    ];

    return (
        <aside className="space-y-8">
            {/* Vastu & Integrity Section */}
            <Card className="glass-dark-2 border-primary/10 rounded-[2rem] overflow-hidden">
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline font-black text-xl flex items-center gap-3">
                        <Zap className="h-5 w-5 text-accent" />
                        Institutional Insights
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-6">
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-3">
                            <Compass className="h-5 w-5 text-primary" />
                            <span className="text-sm font-bold uppercase tracking-wider">Vastu Score</span>
                        </div>
                        <Badge className="bg-primary/20 text-primary border-primary/20 font-black">9.5/10</Badge>
                    </div>

                    <div className="space-y-4 pt-2">
                        <div className="flex items-center gap-3 text-sm font-bold opacity-60 uppercase tracking-widest">
                            <Building2 className="h-4 w-4" />
                            Strategic Nodes
                        </div>
                        <ul className="grid gap-3">
                            <li className="flex justify-between text-sm">
                                <span className="opacity-70">IT Corridor Outer Ring Road</span>
                                <span className="font-black text-primary">12 mins</span>
                            </li>
                            <li className="flex justify-between text-sm">
                                <span className="opacity-70">Upcoming Metro Phase III</span>
                                <span className="font-black text-primary">08 mins</span>
                            </li>
                        </ul>
                    </div>
                </CardContent>
            </Card>

            {/* ROI Projection Section */}
            <Card className="glass-dark-2 border-accent/20 rounded-[2rem] overflow-hidden relative">
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 blur-3xl rounded-full" />
                <CardHeader className="p-8 pb-4">
                    <CardTitle className="font-headline font-black text-xl flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-accent" />
                        ROI Projections
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-8 pt-0 space-y-4">
                    {projections.map((p, i) => (
                        <div key={i} className="flex justify-between items-end border-b border-white/5 pb-4 last:border-0 last:pb-0">
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{p.label}</p>
                                <p className="text-2xl font-black font-headline tracking-tighter">{p.value}</p>
                            </div>
                            <Badge className="bg-primary/10 text-primary border-primary/10 text-[10px] font-black">{p.trend}</Badge>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Banking Section */}
            <div className="px-4 py-8 rounded-[2rem] bg-secondary/5 border border-white/5 space-y-6">
                <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] opacity-40 italic">
                    Authorized Lending Partners
                </p>
                <div className="flex justify-center items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                    {banks.map(bank => (
                        <div key={bank.name} className="flex flex-col items-center gap-2">
                            <span className="text-2xl">{bank.logo}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest">{bank.name}</span>
                        </div>
                    ))}
                </div>
            </div>
        </aside>
    );
}
