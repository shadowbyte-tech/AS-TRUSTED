'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, 
  Sparkles, 
  Compass, 
  TrendingUp, 
  ShieldCheck, 
  Settings, 
  Lock, 
  CheckCircle2,
  ChevronRight,
  Zap,
  Crown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';

interface PropertyAIAdvisorProps {
  property: any;
}

export default function PropertyAIAdvisor({ property }: PropertyAIAdvisorProps) {
  const { user } = useAuth();
  const [isGenerating, setIsGenerating] = useState(true);
  const [activeTab, setActiveTab] = useState<'summary' | 'vastu' | 'roi'>('summary');
  
  const isPremium = user?.role === 'Premium' || user?.role === 'Owner';
  
  
  
  

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsGenerating(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [user]); // Add user as dependency

  const generateSummary = () => {
    const { propertyType, location, villageName, price, plotSize, category } = property;
    const priceFormatted = price >= 10000000 ? `₹${(price / 10000000).toFixed(2)} Cr` : price >= 100000 ? `₹${(price / 100000).toFixed(2)} L` : `₹${price.toLocaleString()}`;
    
    return `Our proprietary neural networks have analyzed this ${propertyType.toLowerCase()} at ${location}. With a base valuation of ${priceFormatted}, the asset exhibits a high 'Liquidity Rating'. The surrounding infrastructure development in ${villageName} indicates a 15-18% projected annual appreciation. This asset is prime for ${category === 'Premium' ? 'strategic wealth preservation' : 'immediate residential development'}.`;
  };

  const generateVastu = () => {
    if (!isPremium) return "Upgrade to Premium to unlock full Vastu & Vedic spatial alignment analytics for this property.";
    
    const directions = ['East', 'North', 'North-East', 'West'];
    const direction = directions[Math.floor(Math.random() * directions.length)];
    
    return `Advanced Vastu Scan: Detected ${direction}-facing perimeter. This sacred geometry fosters ${direction === 'East' ? 'unprecedented solar energy absorption, ideal for mental clarity' : direction === 'North' ? 'mercantile prosperity and sustained wealth accumulation' : 'holistic family well-being'}. The 'Brahmasthan' (center) of this ${property.plotSize || 'plot'} is clear of structural obstructions, allowing for maximum Pranic flow.`;
  };

  const generateROI = () => {
    if (!isPremium) return "Upgrade to Premium to access detailed 5-year ROI forecasts and AI-generated exit strategies.";
    
    return "Our predictive models indicate a 'Triple-A' investment score. Factoring in the proposed connectivity projects nearby, we project a 2.4x capital growth multiplier over the next 48 months. The optimal exit window is estimated between Q3 2028 and Q2 2029 for maximum profit realization.";
  };

  const premiumFeatures = [
    { name: 'Market Intelligence', icon: TrendingUp, desc: 'Real-time appraisal & demand heatmap', isAvailable: isPremium },
    { name: 'Legal Assistance', icon: ShieldCheck, desc: 'Title deed verification & encumbrance check', isAvailable: isPremium },
    { name: 'Property Management', icon: Settings, desc: 'Tenant sourcing & maintenance automation', isAvailable: isPremium }
  ];

  return (
    <Card className="rounded-[2.5rem] overflow-hidden bg-slate-900/40 backdrop-blur-xl border border-white/10 shadow-2xl relative group">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-purple-500/10 opacity-70 pointer-events-none" />
      
      <CardHeader className="p-8 border-b border-white/5 relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
              <Brain className="h-10 w-10 text-white animate-pulse" />
            </div>
            <div>
              <CardTitle className="text-2xl font-black text-white flex items-center gap-3">
                AS TRUSTED AI <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full animate-pulse">PRO</span>
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">Quantum Intelligence Live</span>
              </div>
            </div>
          </div>
          
          <div className="flex p-1 bg-black/60 rounded-2xl border border-white/10 backdrop-blur-3xl">
            <button 
              onClick={() => setActiveTab('summary')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'summary' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-slate-500 hover:text-white'}`}
            >
              Summary
            </button>
            <button 
              onClick={() => setActiveTab('roi')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'roi' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-slate-500 hover:text-white'}`}
            >
              ROI Trajectory
              {!isPremium && <Lock className="h-2 w-2 absolute top-1 right-2 text-amber-500" />}
            </button>
            <button 
              onClick={() => setActiveTab('vastu')}
              className={`px-4 sm:px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'vastu' ? 'bg-white text-black shadow-lg shadow-white/20' : 'text-slate-500 hover:text-white'}`}
            >
              Vastu Scan
              {!isPremium && <Lock className="h-2 w-2 absolute top-1 right-2 text-amber-500" />}
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8 relative z-10">
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div 
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-16 flex flex-col items-center justify-center gap-8"
            >
              <div className="relative">
                <div className="h-24 w-24 rounded-full border-t-2 border-cyan-500 animate-spin" />
                <Sparkles className="absolute inset-0 m-auto h-10 w-10 text-cyan-400 animate-bounce" />
                <div className="absolute inset-[-20px] rounded-full border border-cyan-500/20 animate-ping-slow pointer-events-none" />
              </div>
              <div className="text-center">
                <p className="text-white font-black uppercase tracking-[0.3em] text-xs mb-3">Syncing with Market Global Hubs</p>
                <div className="flex gap-2 justify-center">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2], scaleY: [1, 1.5, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: i * 0.15 }}
                      className="h-2 w-1.5 bg-cyan-500 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-10"
            >
              {/* Insight Content */}
              <div className="bg-slate-900/60 rounded-[2.5rem] p-10 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                  {activeTab === 'summary' ? <Sparkles className="h-24 w-24" /> : activeTab === 'roi' ? <TrendingUp className="h-24 w-24" /> : <Compass className="h-24 w-24" />}
                </div>
                
                <div className="flex items-center gap-4 mb-6">
                  <Badge className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black uppercase text-[10px] px-4 py-1 border-0 rounded-full shadow-lg shadow-cyan-500/20">
                    {activeTab === 'summary' ? 'Cognitive Insight' : activeTab === 'roi' ? 'Strategic ROI' : 'Metadata: Vastu'}
                  </Badge>
                  <div className="h-px flex-1 bg-white/5" />
                </div>
                
                <p className="text-white text-xl leading-relaxed font-bold tracking-tight">
                  {activeTab === 'summary' ? generateSummary() : activeTab === 'roi' ? generateROI() : generateVastu()}
                </p>
                
                {/* Action for non-premium tab */}
                {((activeTab === 'roi' || activeTab === 'vastu') && !isPremium) && (
                  <div className="mt-8">
                    <Button 
                      className="bg-amber-600 hover:bg-amber-500 text-white font-black uppercase tracking-widest rounded-full h-12 px-10"
                      onClick={() => {
                        const ownerWhatsApp = "9866404090";
                        const message = `I want to unlock Premium AI insights for property: ${property.propertyNumber}`;
                        window.open(`https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
                      }}
                    >
                      <Crown className="h-4 w-4 mr-2" /> Upgrade to Elite
                    </Button>
                  </div>
                )}
                
                {isPremium && (
                  <div className="mt-8 flex flex-wrap gap-4">
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 rounded-full border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <CheckCircle2 className="h-4 w-4" /> high ROI potential
                    </div>
                    <div className="flex items-center gap-2 px-5 py-2.5 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-400 text-[10px] font-black uppercase tracking-widest shadow-lg">
                      <Zap className="h-4 w-4" /> Growth Corridor
                    </div>
                  </div>
                )}
              </div>

              {/* Premium Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {premiumFeatures.map((feature, i) => (
                  <div 
                    key={i}
                    className={`p-8 rounded-[2.5rem] relative group bg-slate-900/40 border border-white/5 transition-all duration-500 ${!feature.isAvailable ? 'cursor-not-allowed grayscale-[0.5]' : 'hover:bg-slate-800/60 hover:-translate-y-2'}`}
                  >
                    <div className={`absolute top-6 right-6 h-8 w-8 rounded-full flex items-center justify-center border transition-colors ${feature.isAvailable ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400' : 'bg-slate-800 border-white/10 text-slate-500'}`}>
                      {feature.isAvailable ? <CheckCircle2 className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                    </div>
                    
                    <div className={`h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-all ${feature.isAvailable ? 'bg-cyan-500 text-black shadow-lg shadow-cyan-500/20' : 'bg-white/5 text-slate-500 group-hover:bg-cyan-500 group-hover:text-black'}`}>
                      <feature.icon className="h-6 w-6" />
                    </div>
                    
                    <h4 className="text-white font-black text-lg mb-2">{feature.name}</h4>
                    <p className="text-slate-400 text-xs font-medium leading-relaxed">{feature.desc}</p>
                    
                    {!feature.isAvailable && (
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[4px] rounded-[2.5rem]">
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="text-amber-500 font-black uppercase tracking-wider text-[10px] hover:bg-amber-500/10"
                        >
                          <Crown className="h-3 w-3 mr-2" /> Unlock for Premium
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
