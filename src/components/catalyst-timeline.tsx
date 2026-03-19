'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, CheckCircle2, Circle } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function CatalystTimeline() {
    const { user } = useAuth();

    // Hide component completely for non-authenticated users or regular users
    // Only show for Premium users and Owners
    if (!user || (user.role !== 'Premium' && user.role !== 'Owner')) {
        return null;
    }

    const milestones = [
        { year: '2025 Q3', event: 'Mokila-Shankarpally Highway Expansion', status: 'Completed', icon: CheckCircle2, active: false },
        { year: '2026 Q1', event: 'Regional Ring Road Phase 1 Connectivity', status: 'In Progress', icon: CheckCircle2, active: true },
        { year: '2027 Q2', event: 'IT Hub Phase II Operational', status: 'Approved', icon: Circle, active: false },
        { year: '2028 Q4', event: 'Metro Connectivity Expansion', status: 'Projected', icon: Circle, active: false },
    ];

    return (
        <Card className="glass-dark-2 border-white/5 rounded-[3rem] overflow-hidden">
            <CardHeader className="p-10 pb-4">
                <CardTitle className="font-headline font-black text-3xl tracking-tight flex items-center gap-4">
                    <Calendar className="h-8 w-8 text-primary" />
                    Future Catalysts
                </CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-6">
                <div className="relative space-y-12">
                    {/* Timeline Line */}
                    <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-primary via-primary/20 to-transparent" />

                    {milestones.map((m, i) => (
                        <div key={i} className="relative pl-12 group">
                            <div className={`absolute left-0 top-1 h-6 w-6 rounded-full border-2 bg-background flex items-center justify-center transition-all duration-500 ${m.active ? 'border-primary shadow-[0_0_15px_rgba(var(--primary),0.5)]' : 'border-white/10'}`}>
                                <m.icon className={`h-3 w-3 ${m.active ? 'text-primary' : 'text-white/10'}`} />
                            </div>
                            <div className="space-y-1">
                                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${m.active ? 'text-primary' : 'opacity-40'}`}>
                                    {m.year}
                                </span>
                                <h4 className="text-xl font-bold font-headline leading-tight group-hover:text-primary transition-colors cursor-default">
                                    {m.event}
                                </h4>
                                <p className="text-sm opacity-50 font-medium">{m.status}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
