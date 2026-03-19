'use client';

import { ShieldCheck } from 'lucide-react';

export default function LegalSeal() {
    return (
        <div className="absolute top-6 right-6 z-20 group">
            <div className="relative flex items-center justify-center h-24 w-24 rounded-full glass-dark-2 border-primary/20 shadow-2xl animate-float gold-shimmer cursor-help">
                <svg
                    viewBox="0 0 100 100"
                    className="absolute w-full h-full animate-[spin_10s_linear_infinite] p-1"
                >
                    <path
                        id="textPath"
                        d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0"
                        fill="none"
                    />
                    <text className="fill-primary font-black uppercase tracking-[0.2em] text-[8px]">
                        <textPath href="#textPath">
                            • LEGAL SANCTITY VERIFIED • AS TRUSTED ADVISORY
                        </textPath>
                    </text>
                </svg>
                <div className="relative z-10 h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
                    <ShieldCheck className="h-6 w-6 text-primary animate-pulse" />
                </div>
            </div>
        </div>
    );
}
