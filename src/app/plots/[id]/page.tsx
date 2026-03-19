'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Phone, 
  MessageCircle, 
  Calendar, 
  CheckCircle, 
  TrendingUp, 
  Shield,
  Home,
  Ruler,
  IndianRupee,
  ArrowLeft,
  Share2,
  Heart,
  Compass,
  LayoutDashboard,
  Clock,
  Zap,
  FileText
} from 'lucide-react';
import Image from 'next/image';
import { useAuth } from '@/lib/auth-context';
import AIInvestmentScore from '@/components/ai-investment-score';
import CatalystTimeline from '@/components/catalyst-timeline';
import DueDiligenceCenter from '@/components/due-diligence-center';
import ROISidebar from '@/components/roi-sidebar';

interface Plot {
  id: string;
  plotNumber: string;
  villageName: string;
  areaName: string;
  plotSize: string;
  plotFacing: string;
  price: number;
  description: string;
  imageUrl: string;
  status: string;
  isDtcpApproved?: boolean;
  isReadyToConstruct?: boolean;
  hasHighwayAccess?: boolean;
  category?: string;
  createdAt: string;
}

export default function PlotDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [plot, setPlot] = useState<Plot | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchPlot = async () => {
      try {
        const response = await fetch(`/api/plots/${params.id}`);
        if (response.ok) {
          const plotData = await response.json();
          setPlot(plotData);
        }
      } catch (error) {
        console.error('Error fetching plot:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) fetchPlot();
  }, [params.id]);

  const handleWhatsAppInquiry = () => {
    if (!plot) return;
    const message = `Hi! I'm interested in the premium plot at ${plot.villageName}, ${plot.areaName}. Plot Size: ${plot.plotSize}, Price: ₹${plot.price?.toLocaleString('en-IN')}. Can you share more details?`;
    window.open(`https://wa.me/919866404090?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCallNow = () => {
    window.open('tel:+919866404090');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center gap-6"
        >
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full animate-pulse" />
          </div>
          <p className="text-primary font-bold tracking-[0.3em] uppercase text-[10px]">Encrypting Luxury Assets</p>
        </motion.div>
      </div>
    );
  }

  if (!plot) return null;

  const isPremium = plot.category === 'Premium';

  return (
    <div className="min-h-screen bg-[#0a0a0b] text-slate-100 selection:bg-primary/30 selection:text-white">
      <Header />
      
      {/* Institutional Hero */}
      <section className="relative h-[75vh] w-full overflow-hidden">
        <motion.div 
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 h-[110%] -top-[10%]"
        >
          <Image
            src={plot.imageUrl || 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000'}
            alt=""
            fill
            className="object-cover opacity-60"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b] via-transparent to-[#0a0a0b]/40" />
        </motion.div>

        <div className="container relative h-full z-10 flex flex-col justify-end pb-24 px-4 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl space-y-8"
          >
            <div className="flex flex-wrap gap-4">
              <Badge className="bg-primary hover:bg-primary/90 text-white font-black tracking-widest text-[10px] uppercase px-4 py-1.5 rounded-full border-none shadow-[0_0_20px_rgba(var(--primary),0.4)]">
                 Investment Grade Asset
              </Badge>
              {plot.isDtcpApproved && (
                <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-black tracking-widest text-[10px] uppercase px-4 py-1.5 rounded-full backdrop-blur-md">
                   DTCP Authenticated
                </Badge>
              )}
              {isPremium && (
                <Badge className="bg-accent/20 text-accent border border-accent/30 font-black tracking-widest text-[10px] uppercase px-4 py-1.5 rounded-full backdrop-blur-md">
                   Elite Territory
                </Badge>
              )}
            </div>

            <div className="space-y-4">
              <h1 className="text-5xl md:text-8xl font-black font-headline tracking-tighter leading-none italic">
                {plot.villageName} <br />
                <span className="text-primary not-italic">{plot.areaName}</span>
              </h1>
              
              <div className="flex items-center gap-6 text-slate-400 font-medium tracking-tight overflow-x-auto no-scrollbar pb-2">
                <div className="flex items-center gap-2 shrink-0">
                  <MapPin className="h-4 w-4 text-primary" />
                  <span>Kamareddy District Corridor</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Clock className="h-4 w-4 text-primary" />
                  <span>{plot.createdAt ? `Established ${new Date(plot.createdAt).toLocaleDateString()}` : 'Strategic Asset'}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Compass className="h-4 w-4 text-primary" />
                  <span>{plot.plotFacing} Oriented</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Intelligence Grid */}
      <div className="container px-4 sm:px-6 -mt-20 relative z-20 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          <div className="lg:col-span-8 space-y-12">
            {/* Quick Specs - Luxury Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {[
                { label: 'Asset Magnitude', value: plot.plotSize, icon: Ruler, sub: 'Total Square Feet' },
                { label: 'Price Leverage', value: `₹${(plot.price || 0).toLocaleString('en-IN')}`, icon: Zap, sub: 'Institutional Rate' },
                { label: 'Facing Utility', value: plot.plotFacing, icon: Compass, sub: 'Vastu Aligned' },
                { label: 'Legal Posture', value: plot.isDtcpApproved ? 'DTCP' : 'Clear', icon: Shield, sub: 'Title Verified' },
              ].map((spec, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-[2.5rem] bg-[#121214] border border-white/5 hover:border-primary/30 transition-all group"
                >
                  <div className="h-10 w-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
                    <spec.icon className="h-5 w-5" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{spec.label}</p>
                  <p className="text-lg font-black font-headline tracking-tighter">{spec.value}</p>
                  <p className="text-[9px] opacity-40 font-bold uppercase mt-1 tracking-wider">{spec.sub}</p>
                </motion.div>
              ))}
            </div>

            {/* Narrative Section */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-8 md:p-12 rounded-[3.5rem] bg-[#121214] border border-white/5 relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-1 h-8 bg-primary rounded-full" />
                  <h2 className="text-3xl font-black font-headline italic tracking-tight">Institutional Narrative</h2>
                </div>
                
                <div className="prose prose-invert max-w-none">
                  <p className="text-lg text-slate-400 leading-relaxed font-medium">
                    {plot.description || "This prime residential asset is strategically positioned within the burgeoning Kamareddy investment corridor. Featuring superior connectivity to infrastructure nodes and an impeccable title chain, the property serves as a high-alpha vehicle for wealth preservation and strategic appreciation."}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                   <div className="flex items-center gap-4 p-5 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-emerald-400">Title investigation completed by 10/10 legal audit.</span>
                   </div>
                   <div className="flex items-center gap-4 p-5 rounded-3xl bg-primary/5 border border-primary/10">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                        <TrendingUp className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-bold text-primary-foreground/70">Projected yield outperforming neighborhood benchmarks.</span>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* AI Score & Timeline Grid - Only show for Premium users and Owners */}
            {user && (user.role === 'Premium' || user.role === 'Owner') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <AIInvestmentScore />
                  <CatalystTimeline />
              </div>
            )}

            {user && (user.role === 'Premium' || user.role === 'Owner') && <DueDiligenceCenter />}
          </div>

          <aside className="lg:col-span-4 space-y-8">
            {/* Investment Sidebar Card */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28 space-y-8"
            >
              <Card className="rounded-[3rem] bg-[#121214] border-white/10 shadow-3xl overflow-hidden">
                <div className="p-8 bg-gradient-to-br from-primary/10 to-accent/10 border-b border-white/10 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">Acquisition Price</p>
                      <div className="text-5xl font-black font-headline tracking-tighter flex items-baseline gap-2">
                        ₹{(plot.price || 0).toLocaleString('en-IN')}
                        <span className="text-sm font-bold opacity-30 tracking-normal italic uppercase">O.N.O</span>
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 blur-3xl rounded-full" />
                </div>
                
                <CardContent className="p-8 space-y-6">
                  <div className="space-y-4">
                    <Button 
                      className="w-full h-16 rounded-2xl bg-[#25D366] hover:bg-[#128C7E] text-white font-black text-xs uppercase tracking-[0.2em] shadow-[0_15px_30px_rgba(37,211,102,0.2)]"
                      onClick={handleWhatsAppInquiry}
                    >
                      <MessageCircle className="h-5 w-5 mr-3" /> Secure Portfolio Lock
                    </Button>
                    <Button 
                      variant="outline"
                      className="w-full h-16 rounded-2xl border-white/5 bg-white/5 hover:bg-white/10 text-white font-black text-xs uppercase tracking-[0.2em]"
                      onClick={handleCallNow}
                    >
                       Direct Advisory Access
                    </Button>
                  </div>

                  <div className="pt-6 border-t border-white/5 space-y-4">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center italic">Transaction Security Suite</p>
                    <div className="grid grid-cols-3 gap-4">
                      {[ 
                        { icon: Shield, label: 'Verified' },
                        { icon: FileText, label: 'Audit Ready' },
                        { icon: Home, label: 'Ready' }
                      ].map((item, i) => (
                        <div key={i} className="flex flex-col items-center gap-2 opacity-40">
                          <item.icon className="h-4 w-4" />
                          <span className="text-[8px] font-black uppercase tracking-tighter whitespace-nowrap">{item.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <ROISidebar plot={plot} />
            </motion.div>
          </aside>

        </div>
      </div>

      <Footer />
      
      {/* Dynamic CTA Bar - Mobile */}
      <div className="fixed bottom-0 inset-x-0 p-4 bg-black/60 backdrop-blur-3xl border-t border-white/10 lg:hidden flex gap-3 z-50">
        <Button 
          className="flex-1 h-14 rounded-2xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl"
          onClick={handleWhatsAppInquiry}
        >
          Acquire Asset
        </Button>
        <Button 
          variant="outline"
          size="icon"
          className="h-14 w-14 rounded-2xl bg-[#121214] border-white/10 text-white"
          onClick={handleCallNow}
        >
          <Phone className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}
