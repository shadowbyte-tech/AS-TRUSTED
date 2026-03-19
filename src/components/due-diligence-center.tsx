'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, CheckCircle2, FileText, Scale, BadgeCheck } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function DueDiligenceCenter() {
    const { user } = useAuth();

    // Hide component completely for non-authenticated users or regular users
    // Only show for Premium users and Owners
    if (!user || (user.role !== 'Premium' && user.role !== 'Owner')) {
        return null;
    }

    const legalChecks = [
        { label: 'Title Verification', status: 'Clear & Marketable', icon: ShieldCheck },
        { label: 'Land Conversion (NA)', status: 'Approved (Residential)', icon: Scale },
        { label: 'Encumbrance Certificate', status: 'Nil Encumbrance', icon: FileText },
        { label: 'Layout Approval', status: 'DTCP/HMDA Approved', icon: BadgeCheck },
        { label: 'Government RERA', status: 'Registered', icon: CheckCircle2 },
    ];

    return (
        <Card className="glass-dark-2 border-primary/20 rounded-[3rem] overflow-hidden relative">
            <div className="absolute top-6 right-8 z-10">
                <div className="flex flex-col items-center">
                    <div className="h-20 w-20 rounded-full border-2 border-accent/30 flex items-center justify-center bg-accent/5 backdrop-blur-xl animate-pulse">
                        <ShieldCheck className="h-10 w-10 text-accent" />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-accent mt-2">Legal Sanctity Verified</span>
                </div>
            </div>

            <CardHeader className="p-10 pb-4">
                <CardTitle className="font-headline font-black text-3xl tracking-tight">
                    Due Diligence Center
                </CardTitle>
                <p className="text-sm text-muted-foreground/60 max-w-md">
                    A comprehensive audit of legal documentation conducted by our senior advisory counsel.
                </p>
            </CardHeader>

            <CardContent className="p-10 pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                    {legalChecks.map((check, i) => (
                        <div key={i} className="flex items-start gap-4 p-5 rounded-3xl bg-secondary/5 border border-white/5 group hover:bg-secondary/10 transition-all duration-500">
                            <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                                <check.icon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-widest opacity-40">{check.label}</p>
                                <p className="font-bold text-sm tracking-tight">{check.status}</p>
                                <div className="flex items-center gap-1.5 pt-1">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <span className="text-[9px] font-bold text-green-500/80 uppercase tracking-tighter">Verified</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-10 p-6 rounded-[2rem] bg-accent/5 border border-accent/10 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <Scale className="h-6 w-6" />
                        </div>
                        <div>
                            <h4 className="font-bold text-sm">Download Legal Audit PDF</h4>
                            <p className="text-xs opacity-50 italic">Full title investigation report (24 Pages)</p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 rounded-full bg-accent text-accent-foreground font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">
                        Access Vault
                    </button>
                </div>
            </CardContent>
        </Card>
    );
}
