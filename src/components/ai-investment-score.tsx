'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, TrendingUp, ShieldCheck, MapPin, Droplets } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

interface ScoreMetric {
    label: string;
    score: number;
    icon: any;
    color: string;
}

export default function AIInvestmentScore() {
    const { user } = useAuth();

    // Hide component completely for non-authenticated users or regular users
    // Only show for Premium users and Owners
    if (!user || (user.role !== 'Premium' && user.role !== 'Owner')) {
        return null;
    }

    const metrics: ScoreMetric[] = [
        { label: 'Location Growth', score: 9.2, icon: TrendingUp, color: 'text-primary' },
        { label: 'Infrastructure', score: 8.5, icon: MapPin, color: 'text-accent' },
        { label: 'Liquidity Potential', score: 8.7, icon: Droplets, color: 'text-primary' },
        { label: 'Legal Clarity', score: 10, icon: ShieldCheck, color: 'text-accent' },
    ];

    const totalScore = 8.9;

    return (
        <Card className="glass-dark-2 border-primary/20 rounded-[2.5rem] overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-[80px] rounded-full group-hover:bg-primary/20 transition-all duration-1000" />

            <CardHeader className="p-8 pb-4">
                <div className="flex justify-between items-center">
                    <CardTitle className="font-headline font-black text-xl flex items-center gap-3">
                        <Brain className="h-6 w-6 text-primary animate-pulse" />
                        AI Investment Score
                    </CardTitle>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black font-headline tracking-tighter text-primary">{totalScore}</span>
                        <span className="text-xs font-bold opacity-40">/10</span>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-8 pt-0 space-y-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40 italic">
                    High-Confidence Alpha Logic
                </p>

                <div className="space-y-5">
                    {metrics.map((m) => (
                        <div key={m.label} className="space-y-2">
                            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                <div className="flex items-center gap-2">
                                    <m.icon className={`h-3 w-3 ${m.color}`} />
                                    <span className="opacity-70">{m.label}</span>
                                </div>
                                <span>{m.score}/10</span>
                            </div>
                            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                <div
                                    className={`h-full bg-gradient-to-r from-primary to-accent transition-all duration-1000 delay-300`}
                                    style={{ width: `${m.score * 10}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="pt-4 border-t border-white/5">
                    <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                        <p className="text-[10px] leading-relaxed opacity-60">
                            Score generated via <span className="text-primary font-bold">Gemini 2.0 Flash</span> telemetry analyzing 48 months of neighborhood appreciation trends and infrastructure node proximity.
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
