import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function HeroSection() {
    const { user } = useAuth();
    return (
        <section className="relative min-h-[90vh] flex items-center pt-24 pb-12 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent" />
                <div className="absolute -top-[10%] -right-[10%] w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center relative z-10">
                {/* Left Side: Content */}
                <div className="space-y-6 animate-in fade-in slide-in-from-left duration-1000">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs sm:text-sm font-medium">
                        <ShieldCheck className="w-4 h-4 shrink-0" />
                        <span>Institutional Grade Land Investments</span>
                    </div>

                    <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight text-foreground font-black">
                        Find Your Future <br />
                        <span className="text-primary italic">Property</span> <br />
                        <span className="bg-gradient-to-r from-accent to-accent/60 bg-clip-text text-transparent">Investment</span>
                    </h1>

                    <p className="text-base sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
                        Your trusted partner in real estate — DTCP approved plots, villa plots, and farm lands across Telangana.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                        <Button size="lg" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto" asChild>
                            <Link href="/properties">
                                Explore Properties
                                <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="rounded-full h-12 sm:h-14 px-6 sm:px-8 text-base sm:text-lg w-full sm:w-auto" asChild>
                            <Link href="/book-site-visit">
                                Book Free Site Visit
                            </Link>
                        </Button>
                    </div>

                    <div className="flex items-center gap-6 sm:gap-8 pt-4 border-t border-border/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">Global NRI Access</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-accent/10 flex items-center justify-center shrink-0">
                                <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                            </div>
                            <span className="text-xs sm:text-sm font-medium text-muted-foreground whitespace-nowrap">+18% Avg ROI</span>
                        </div>
                    </div>
                </div>

                {/* Right Side: Visual - Hidden on mobile to avoid overflow */}
                <div className="relative animate-in fade-in zoom-in duration-1000 delay-300 hidden lg:block">
                    <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/50 aspect-[4/5] bg-muted">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center">
                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                        </div>

                        {/* Floating Cards */}
                        <div className="absolute top-10 left-10 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 z-20">
                            <div className="text-xs text-white/80 font-medium">Growth Zone</div>
                            <div className="text-lg font-bold text-white">Hyderabad Corridor</div>
                        </div>

                        <div className="absolute bottom-10 right-10 p-6 bg-black/70 backdrop-blur-md rounded-xl border border-white/20 text-white max-w-[200px] z-20">
                            <div className="text-accent text-3xl font-bold">9.2</div>
                            <div className="text-xs text-white/70 mt-1">Infrastructure Score</div>
                            <div className="h-1 w-full bg-white/20 mt-3 rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-[92%]" />
                            </div>
                        </div>

                        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 z-20">
                            <div className="text-xs text-white/80 font-medium">Prime Location</div>
                            <div className="text-lg font-bold text-white">Kamareddy</div>
                        </div>
                    </div>

                    {/* Decorative Rings */}
                    <div className="absolute -z-10 -bottom-10 -left-10 w-full h-full border border-primary/20 rounded-2xl rotate-3" />
                    <div className="absolute -z-10 -top-10 -right-10 w-full h-full border border-accent/20 rounded-2xl -rotate-3" />
                </div>
            </div>
        </section>
    );
}
