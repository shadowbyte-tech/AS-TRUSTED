
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, MapPin, Building2, Zap } from "lucide-react";

const zones = [
    {
        name: "Hyderabad IT Corridor",
        appreciation: "+12% YoY",
        infrastructure: ["IT Hub", "Metro Connectivity", "International Schools"],
        status: "High Growth",
        image: "https://images.unsplash.com/photo-1486310336555-9ec5382c1d3e?q=80&w=1000",
        color: "from-blue-600 to-indigo-600"
    },
    {
        name: "Kamareddy Growth Zone",
        appreciation: "+15% YoY",
        infrastructure: ["Nizamsagar Road", "Industrial Parks", "Railway Connectivity"],
        status: "Strategic",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=1000",
        color: "from-amber-500 to-orange-600"
    },
    {
        name: "Sangareddy Development",
        appreciation: "+18% YoY",
        infrastructure: ["Pharma City", "Outer Ring Road", "Industrial Estate"],
        status: "Premium",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000",
        color: "from-emerald-500 to-teal-600"
    }
];

export default function InvestmentZones() {
    return (
        <section className="py-16 md:py-24 bg-background overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
                    <div className="space-y-4 max-w-2xl">
                        <h2 className="text-3xl md:text-5xl font-headline text-foreground">
                            Curated <span className="text-primary italic">Investment</span> Zones
                        </h2>
                        <p className="text-muted-foreground text-base md:text-lg">
                            We focus on high-yield corridors where infrastructure catalysts drive
                            exponential land value appreciation.
                        </p>
                    </div>
                    <Badge variant="outline" className="px-4 md:px-6 py-2 rounded-full border-accent text-accent animate-pulse text-sm">
                        Live Market Updates
                    </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                    {zones.map((zone, index) => (
                        <Card key={index} className="group relative overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 rounded-2xl">
                            <div className="aspect-[4/3] relative overflow-hidden bg-gradient-to-br from-primary/20 to-accent/20">
                                <img
                                    src={zone.image}
                                    alt={zone.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    loading="lazy"
                                    onError={(e) => {
                                        e.currentTarget.src = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1000';
                                    }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                                <div className="absolute top-3 md:top-4 left-3 md:left-4">
                                    <Badge className={`bg-gradient-to-r ${zone.color} border-none text-xs md:text-sm`}>
                                        {zone.status}
                                    </Badge>
                                </div>

                                <div className="absolute bottom-4 md:bottom-6 left-3 md:left-6 right-3 md:right-6 text-white">
                                    <div className="flex items-center gap-2 text-accent mb-2">
                                        <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                                        <span className="font-bold text-lg md:text-xl">{zone.appreciation}</span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold font-headline">{zone.name}</h3>
                                </div>
                            </div>

                            <CardContent className="p-4 md:p-8 space-y-4 md:space-y-6 bg-card dark:bg-card/50">
                                <div className="space-y-3">
                                    <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Catalysts</div>
                                    <div className="flex flex-wrap gap-1.5 md:gap-2">
                                        {zone.infrastructure.map((item, i) => (
                                            <div key={i} className="flex items-center gap-1 px-2 md:px-2.5 py-1 rounded-md bg-muted text-[9px] md:text-[10px] font-medium border border-border">
                                                <Zap className="w-3 h-3 text-accent shrink-0" />
                                                <span className="hidden sm:inline">{item}</span>
                                                <span className="sm:hidden">{item.split(' ')[0]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-3 md:pt-4 border-t border-border flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-primary font-medium text-xs md:text-sm">
                                        <MapPin className="w-3 h-3 md:w-4 md:h-4" />
                                        <span className="hidden sm:inline">Explore Layouts</span>
                                        <span className="sm:hidden">Explore</span>
                                    </div>
                                    <Building2 className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground opacity-30" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
}
