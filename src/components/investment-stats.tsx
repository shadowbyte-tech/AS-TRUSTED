
import { Users, Layout, MapPin, Handshake } from "lucide-react";

const stats = [
    {
        label: "Verified Plots",
        value: "500+",
        icon: Layout,
        description: "Legal sanctity guaranteed"
    },
    {
        label: "Years Experience",
        value: "12+",
        icon: Users,
        description: "Institutional expertise"
    },
    {
        label: "Land Value Sold",
        value: "₹120Cr+",
        icon: MapPin,
        description: "Trusted by investors"
    },
    {
        label: "Growth Zones",
        value: "4",
        icon: Handshake,
        description: "High appreciation hubs"
    }
];

export default function InvestmentStats() {
    return (
        <section className="py-12 bg-primary text-white overflow-hidden relative">
            {/* Decorative patterns */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,#ffffff_1px,transparent_1px)] bg-[length:40px_40px]" />
            </div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="group text-center space-y-3 animate-in fade-in slide-in-from-bottom duration-700"
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className="mx-auto w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center group-hover:bg-accent group-hover:text-primary transition-all duration-300">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="text-3xl md:text-4xl font-bold font-headline text-accent">
                                    {stat.value}
                                </div>
                                <div className="text-sm font-medium uppercase tracking-widest mt-1 opacity-90">
                                    {stat.label}
                                </div>
                                <div className="text-xs opacity-60 mt-2 max-w-[120px] mx-auto">
                                    {stat.description}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
