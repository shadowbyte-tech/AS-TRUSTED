
import { ShieldCheck, Scale, Landmark, FileCheck, Award } from "lucide-react";

export default function TrustBadges() {
    const badges = [
        { icon: Scale, label: "DTCP Approved", sub: "Legal Sanctity" },
        { icon: ShieldCheck, label: "RERA Verified", sub: "Consumer Shield" },
        { icon: Landmark, label: "Bank Loan Eligible", sub: "HDFC | SBI | ICICI" },
        { icon: FileCheck, label: "Clear Title", sub: "Due Diligence" },
        { icon: Award, label: "Vastu Compliant", sub: "Strategic Design" },
    ];

    return (
        <div className="py-8 border-y border-border/50 bg-background/50 backdrop-blur-sm relative overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-wrap justify-center md:justify-between items-center gap-8 md:gap-4 opacity-70 hover:opacity-100 transition-opacity duration-500">
                    {badges.map((badge, index) => (
                        <div key={index} className="flex items-center gap-3 group">
                            <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-accent/10 transition-colors">
                                <badge.icon className="w-5 h-5 text-primary group-hover:text-accent transition-colors" />
                            </div>
                            <div>
                                <div className="text-sm font-bold tracking-tight text-foreground">{badge.label}</div>
                                <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">{badge.sub}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
