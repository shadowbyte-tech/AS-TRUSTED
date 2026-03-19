'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calculator, IndianRupee, Landmark, TrendingUp } from 'lucide-react';

export default function FinancingCalculator() {
    const [plotPrice, setPlotPrice] = useState(2500000);
    const [downPayment, setDownPayment] = useState(500000);
    const [tenure, setTenure] = useState(10);
    const [interestRate, setInterestRate] = useState(8.5);
    const [emi, setEmi] = useState(0);

    useEffect(() => {
        const principal = plotPrice - downPayment;
        const ratePerMonth = interestRate / 12 / 100;
        const months = tenure * 12;

        if (principal > 0 && ratePerMonth > 0 && months > 0) {
            const emiVal = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, months)) / (Math.pow(1 + ratePerMonth, months) - 1);
            setEmi(Math.round(emiVal));
        } else {
            setEmi(0);
        }
    }, [plotPrice, downPayment, tenure, interestRate]);

    return (
        <Card className="glass-dark-2 border-accent/20 rounded-[2.5rem] overflow-hidden">
            <CardHeader className="p-8 pb-4">
                <CardTitle className="font-headline font-black text-xl flex items-center gap-3">
                    <Calculator className="h-6 w-6 text-accent" />
                    Financing Planner
                </CardTitle>
            </CardHeader>

            <CardContent className="p-8 pt-0 space-y-6">
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Plot Price (₹)</Label>
                        <div className="relative">
                            <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                            <Input
                                type="number"
                                value={plotPrice}
                                onChange={(e) => setPlotPrice(Number(e.target.value))}
                                className="pl-10 h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Down Payment (₹)</Label>
                        <Input
                            type="number"
                            value={downPayment}
                            onChange={(e) => setDownPayment(Number(e.target.value))}
                            className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Tenure (Years)</Label>
                            <Input
                                type="number"
                                value={tenure}
                                onChange={(e) => setTenure(Number(e.target.value))}
                                className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-black tracking-widest opacity-40">Rate (%)</Label>
                            <Input
                                type="number"
                                value={interestRate}
                                onChange={(e) => setInterestRate(Number(e.target.value))}
                                className="h-12 bg-white/5 border-white/10 rounded-xl font-bold"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-primary/10 border border-primary/20 space-y-4">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em] opacity-60">
                        <span>Monthly Commitment</span>
                        <Landmark className="h-4 w-4" />
                    </div>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black font-headline tracking-tighter text-primary">₹{emi.toLocaleString()}</span>
                        <span className="text-xs font-bold opacity-40">/month</span>
                    </div>
                    <div className="pt-2 border-t border-primary/20">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                            <TrendingUp className="h-3 w-3" />
                            Asset Appreciation &gt; Interest Cost
                        </div>
                    </div>
                </div>

                <p className="text-[9px] text-center opacity-30 italic px-4">
                    Estimate based on current institutional rates. Instant loan assistance available for AS Trusted clients.
                </p>
            </CardContent>
        </Card>
    );
}
