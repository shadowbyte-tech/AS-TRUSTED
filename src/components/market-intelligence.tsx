
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, BarChart3, PieChart, Activity, ArrowUpRight } from "lucide-react";

export default function MarketIntelligence() {
    return (
        <section className="py-24 relative overflow-hidden bg-secondary/10">
            <div className="container mx-auto px-4">
                <div className="text-center space-y-4 mb-20">
                    <Badge variant="outline" className="border-accent/30 text-accent uppercase tracking-widest px-4 py-1">
                        Data Intelligence
                    </Badge>
                    <h2 className="text-4xl md:text-6xl font-headline tracking-tight">
                        Investor <span className="text-primary italic">Wealth</span> Dashboard
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                        Experience the future of land investment management with our
                        proprietary appreciation forecasting engine.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    {/* Left Column: ROI Forecast Chart Preview */}
                    <Card className="lg:col-span-8 overflow-hidden border-none shadow-2xl glass-dark-2 rounded-[2rem]">
                        <CardHeader className="flex flex-row items-center justify-between p-8 border-b border-white/5">
                            <div className="space-y-1">
                                <CardTitle className="text-xl font-headline text-white flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-accent" />
                                    Price Appreciation Forecast
                                </CardTitle>
                                <div className="text-xs text-muted-foreground uppercase tracking-widest font-medium">Mokila Strategic Belt</div>
                            </div>
                            <div className="flex gap-2">
                                <Badge className="bg-emerald-500/10 text-emerald-500 border-none">+42% 3Y Projected</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="h-[300px] w-full relative flex items-end justify-between gap-2 pt-8">
                                {/* Mock Chart Bars */}
                                {[
                                    { label: "2024", height: "40%", current: false },
                                    { label: "2025", height: "55%", current: false },
                                    { label: "2026", height: "70%", current: true },
                                    { label: "2027", height: "85%", current: false },
                                    { label: "2028", height: "100%", current: false },
                                ].map((bar, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                                        <div className="relative w-full h-full flex items-end justify-center">
                                            <div
                                                className={`w-full max-w-[60px] rounded-t-xl transition-all duration-1000 ${bar.current ? 'bg-accent shadow-[0_0_30px_rgba(255,193,7,0.3)]' : 'bg-primary/20 group-hover:bg-primary/40'}`}
                                                style={{ height: bar.height }}
                                            />
                                            {bar.current && (
                                                <div className="absolute -top-12 p-2 bg-accent text-primary text-[10px] font-bold rounded shadow-xl animate-bounce-slow">
                                                    YOU ARE HERE
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-xs font-bold text-muted-foreground">{bar.label}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Right Column: Key Metrics */}
                    <div className="lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-xl glass-dark-2 rounded-2xl p-6">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent">
                                    <PieChart className="w-6 h-6" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Asset Distribution</div>
                                    <div className="text-lg font-bold text-white">Residential Plots</div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                {[
                                    { label: "Verified Supply", val: "High", color: "bg-emerald-500" },
                                    { label: "Investor Interest", val: "Critical", color: "bg-amber-500" },
                                    { label: "Legal Clarity", val: "100%", color: "bg-blue-500" },
                                ].map((m, i) => (
                                    <div key={i} className="space-y-1.5 text-xs font-bold uppercase tracking-widest transition-opacity hover:opacity-100 opacity-70">
                                        <div className="flex justify-between">
                                            <span>{m.label}</span>
                                            <span className="text-white">{m.val}</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div className={`h-full ${m.color}`} style={{ width: i === 0 ? "85%" : i === 1 ? "95%" : "100%" }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Card>

                        <Card className="border-none shadow-xl bg-primary text-white rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                <Activity className="w-24 h-24" />
                            </div>
                            <div className="relative z-10 space-y-6">
                                <h4 className="text-lg font-headline">Live Market Sentiment</h4>
                                <div className="text-4xl font-bold text-accent italic">BULLISH</div>
                                <div className="flex items-center gap-2 text-xs font-medium bg-white/10 w-fit px-3 py-1 rounded-full border border-white/5">
                                    <ArrowUpRight className="w-3 h-3" />
                                    +1.2% this week in Mokila Area
                                </div>
                                <p className="text-sm text-white/70 leading-relaxed">
                                    Infrastructure nodes and G.O. updates are driving immediate buyer demand in the West Corridor.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
