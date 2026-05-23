'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { 
  MapPin, TrendingUp, Shield, Crown, Star, ArrowRight, 
  BarChart3, ChevronRight, Quote, Phone,
  Mail, Compass, Ruler, Award,
  Sparkles, Target, Eye, Layout,
  ChevronDown, CalendarCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import type { Plot } from '@/lib/definitions';
import dynamic from 'next/dynamic';

const TelanganaSeoSection = dynamic(() => import('@/components/telangana-seo-section'), { ssr: true });
const Testimonials = dynamic(() => import('@/components/testimonials-fixed'), { ssr: true });
const WhyKamareddy = dynamic(() => import('@/components/why-kamareddy'), { ssr: true });
const FinancialAssistance = dynamic(() => import('@/components/financial-assistance'), { ssr: true });

/* ─── Reusable Animation Components ─────────────────────────────────────── */

function FadeInUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerChildren({ children, className = '', staggerDelay = 0.1 }: { children: React.ReactNode; className?: string; staggerDelay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={{
        visible: { transition: { staggerChildren: staggerDelay } },
        hidden: {}
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

function StaggerItem({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section Header ────────────────────────────────────────────────────── */

function SectionHeader({ 
  badge, 
  title, 
  subtitle, 
  align = 'center',
  gold = false 
}: { 
  badge?: string; 
  title: string; 
  subtitle?: string; 
  align?: 'center' | 'left';
  gold?: boolean;
}) {
  return (
    <div className={`mb-12 md:mb-16 ${align === 'left' ? 'text-left' : 'text-center'}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-5"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {badge}
        </motion.div>
      )}
      <h2 className={`text-3xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight text-foreground ${align === 'center' ? 'mx-auto max-w-3xl' : ''}`}>
        {gold ? (
          <>
            {title.split(' ').map((word, i) => 
              word.startsWith('$') || word.startsWith('₹') || i === title.split(' ').length - 1 
                ? <span key={i} className="text-gold"> {word}</span> 
                : ` ${word}`
            )}
          </>
        ) : (
          title
        )}
      </h2>
      {subtitle && (
        <p className={`mt-4 text-base md:text-lg text-muted-foreground/80 leading-relaxed max-w-2xl ${align === 'center' ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}

/* ─── CountUp Number ────────────────────────────────────────────────────── */

function CountUp({ end, suffix = '', prefix = '', decimals = 0 }: { end: number; suffix?: string; prefix?: string; decimals?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number;
    let rafId: number;
    const duration = 2000;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(eased * end);
      if (progress < 1) rafId = requestAnimationFrame(animate);
    };
    
    rafId = requestAnimationFrame(animate);
    
    return () => {
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [isInView, end]);

  return <span ref={ref}>{prefix}{count.toFixed(decimals)}{suffix}</span>;
}

/* ─── Testimonial Data ──────────────────────────────────────────────────── */

const testimonials = [
  {
    id: '1',
    name: 'Ravi Kumar',
    location: 'Hyderabad',
    investment: '₹15 Lakhs',
    roi: '82%',
    timeline: '3 years',
    currentValue: '₹27.3 Lakhs',
    text: 'I invested in Kamareddy land through AS Trusted in 2021. Today my investment is worth ₹27.3 Lakhs. The legal verification and market insights were exceptional.',
    rating: 5,
  },
  {
    id: '2',
    name: 'Priya Sharma',
    location: 'Bangalore',
    investment: '₹20 Lakhs',
    roi: '75%',
    timeline: '2.5 years',
    currentValue: '₹35 Lakhs',
    text: 'As a first-time land investor, I was nervous about the process. AS Trusted guided me through every step. My investment has grown to ₹35 Lakhs.',
    rating: 5,
  },
  {
    id: '3',
    name: 'Arjun Reddy',
    location: 'Delhi NCR',
    investment: '₹25 Lakhs',
    roi: '88%',
    timeline: '3 years',
    currentValue: '₹47 Lakhs',
    text: 'The ROI projections were conservative — I achieved 88% returns! Their market intelligence helped me identify the best plots before prices skyrocketed.',
    rating: 5,
  },
  {
    id: '4',
    name: 'Sneha Patel',
    location: 'Mumbai',
    investment: '₹12 Lakhs',
    roi: '71%',
    timeline: '2 years',
    currentValue: '₹20.5 Lakhs',
    text: 'The documentation was flawless. They handled everything from title verification to registration. My investment grew to ₹20.5 Lakhs in just 2 years.',
    rating: 5,
  },
];

/* ─── Main Homepage Component ───────────────────────────────────────────── */

export default function HomePage() {
  const [plots, setPlots] = useState<Plot[]>([]);
  const [loading, setLoading] = useState(true);
  const [roiInput, setRoiInput] = useState('1000000');
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.3]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);
  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const response = await fetch('/api/plots', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });
        if (response.ok) {
          const plotsResponse = await response.json();
          setPlots(plotsResponse.data || []);
        }
      } catch (error) {
        console.error('Failed to fetch plots:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlots();
  }, []);

  const featuredPlots = Array.isArray(plots) ? plots.slice(0, 6) : [];
  const roiPrincipal = parseFloat(roiInput) || 0;
  const roiRate = 0.15;
  const roi1yr = roiPrincipal * Math.pow(1 + roiRate, 1);
  const roi3yr = roiPrincipal * Math.pow(1 + roiRate, 3);
  const roi5yr = roiPrincipal * Math.pow(1 + roiRate, 5);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const formatPrice = (price?: number) => {
    if (!price) return 'Price on Request';
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString('en-IN')}`;
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════
           SECTION 1: CINEMATIC HERO
           ═══════════════════════════════════════════════════════════ */}
        <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden bg-navy">
          {/* Background Image with Parallax */}
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ opacity: heroOpacity, scale: heroScale }}
          >
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-navy/95 via-navy/80 to-navy/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/30" />
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px] animate-pulse opacity-50" />
          <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gold/3 rounded-full blur-[100px]" />
          
          {/* Grid Pattern Overlay */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
            backgroundImage: `linear-gradient(rgba(212,175,55,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }} />

          <div className="container relative z-10 px-4 pt-32 pb-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Left: Content */}
              <div className="space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest"
                >
                  <Shield className="h-3.5 w-3.5" />
                  Institutional Grade Land Investments
                </motion.div>

                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold font-headline tracking-tight text-white leading-[1.05]"
                >
                  <span className="text-gradient-gold">Strategic Land</span>
                  <br />
                  <span className="text-white/90">For Generational</span>
                  <br />
                  <span className="text-white">Wealth</span>
                </motion.h1>

                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.2 }}
                  className="text-lg md:text-xl text-white/60 max-w-xl leading-relaxed"
                >
                  Premium DTCP-approved plots in Telangana&apos;s fastest-appreciating corridors. 
                  Every property legally verified, every investment strategically positioned.
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  className="flex flex-wrap gap-4 pt-2"
                >
                  <Button asChild size="lg" className="h-14 px-8 bg-gold hover:bg-gold-light text-black font-bold text-base shadow-xl shadow-gold/30 hover:shadow-gold/40 transition-all duration-300 rounded-xl">
                    <Link href="/properties" className="flex items-center gap-2">
                      Explore Properties
                      <ArrowRight className="h-5 w-5" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="h-14 px-8 border-white/20 text-white hover:bg-white/5 hover:border-white/30 font-semibold text-base rounded-xl transition-all duration-300">
                    <Link href="/book-site-visit" className="flex items-center gap-2">
                      <CalendarCheck className="h-5 w-5" />
                      Book Site Visit
                    </Link>
                  </Button>
                </motion.div>

                {/* Trust Indicators */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-6 pt-6 border-t border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                      {[1,2,3,4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full border-2 border-navy bg-gradient-to-br from-gold/30 to-gold/10" />
                      ))}
                    </div>
                    <span className="text-sm text-white/50">
                      <span className="text-gold font-semibold">500+</span> Investors
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Star className="h-4 w-4 text-gold fill-gold" />
                    <span><span className="text-gold font-semibold">4.9</span> Rating</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/50">
                    <Shield className="h-4 w-4 text-emerald-400" />
                    <span>DTCP Approved</span>
                  </div>
                </motion.div>
              </div>

              {/* Right: Visual */}
              <motion.div 
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="hidden lg:block relative"
              >
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/10 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?q=80&w=1000"
                    alt="Premium Property"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                  
                  {/* Floating Card - Appreciation */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="absolute top-6 left-6 p-4 bg-navy/80 backdrop-blur-xl rounded-xl border border-gold/15 shadow-xl"
                  >
                    <div className="text-xs text-gold/70 font-semibold uppercase tracking-wider">Avg. Appreciation</div>
                    <div className="text-2xl font-bold text-gold mt-1">+18%</div>
                    <div className="text-xs text-white/40 mt-0.5">Annual ROI</div>
                  </motion.div>

                  {/* Floating Card - Location */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                    className="absolute bottom-6 right-6 p-4 bg-navy/80 backdrop-blur-xl rounded-xl border border-gold/15 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gold" />
                      <span className="text-white font-semibold">Kamareddy Corridor</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <TrendingUp className="h-3.5 w-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-400/80">High Growth Zone</span>
                    </div>
                  </motion.div>

                  {/* Floating Card - Verified */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 1.0 }}
                    className="absolute bottom-6 left-6 p-3 bg-emerald-500/20 backdrop-blur-xl rounded-xl border border-emerald-400/20 shadow-xl"
                  >
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-emerald-400" />
                      <span className="text-xs text-emerald-300 font-semibold">100% Legal Verified</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          >
            <span className="text-xs text-white/30 uppercase tracking-widest">Scroll</span>
            <ChevronDown className="h-4 w-4 text-white/30 animate-bounce" />
          </motion.div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 2: TRUST METRICS
           ═══════════════════════════════════════════════════════════ */}
        <section className="relative py-16 bg-navy border-y border-gold/5">
          <div className="container px-4">
            <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
              {[
                { value: 500, suffix: '+', label: 'Verified Plots', icon: Layout, sub: 'Legal sanctity guaranteed' },
                { value: 12, suffix: '+', label: 'Years Experience', icon: Award, sub: 'Institutional expertise' },
                { value: 120, suffix: 'Cr+', prefix: '₹', label: 'Land Value Sold', icon: TrendingUp, sub: 'Trusted by investors' },
                { value: 4, suffix: '', label: 'Growth Corridors', icon: MapPin, sub: 'High appreciation hubs' },
              ].map((stat, i) => (
                <StaggerItem key={i} className="text-center space-y-3">
                  <div className="mx-auto w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/10">
                    <stat.icon className="w-6 h-6 text-gold" />
                  </div>
                  <div>
                    <div className="text-3xl md:text-4xl font-bold font-headline text-gold">
                      <CountUp end={stat.value} suffix={stat.suffix} prefix={stat.prefix || ''} />
                    </div>
                    <div className="text-sm font-semibold text-white/70 mt-1 uppercase tracking-wider">
                      {stat.label}
                    </div>
                    <div className="text-xs text-white/30 mt-1">
                      {stat.sub}
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 3: FEATURED PROPERTIES
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />
          
          <div className="container px-4 relative z-10">
            <FadeInUp>
              <SectionHeader 
                badge="Featured Listings"
                title="Premium Properties in Growth Corridors"
                subtitle="Hand-picked investments with verified legal titles and proven appreciation potential in Telangana's fastest-developing regions."
              />
            </FadeInUp>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-[400px] rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : featuredPlots.length > 0 ? (
              <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPlots.slice(0, 6).map((plot) => (
                  <StaggerItem key={plot.id}>
                    <Link href={`/properties/${plot.id}`} className="group block h-full">
                      <Card className="h-full overflow-hidden bg-card border-border/50 hover:border-gold/30 transition-all duration-500 shadow-sm hover:shadow-gold-lg group">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={plot.imageUrl || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=600'}
                            alt={plot.propertyNumber || 'Property'}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          <div className="absolute top-4 left-4 flex flex-col gap-2">
                            <Badge className="bg-gold/90 text-black border-none font-bold text-xs uppercase tracking-wider shadow-lg">
                              {plot.status || 'Available'}
                            </Badge>
                          </div>

                          <div className="absolute bottom-4 left-4 right-4">
                            <p className="text-white font-bold text-lg drop-shadow-lg">
                              {formatPrice(plot.price)}
                            </p>
                          </div>
                        </div>
                        
                        <CardContent className="p-5 space-y-4">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="text-[10px] font-bold uppercase tracking-wider text-gold border-gold/20 bg-gold/5">
                                {plot.plotType || 'Plot'}
                              </Badge>
                              <h3 className="font-bold text-base truncate group-hover:text-gold transition-colors">
                                {plot.propertyNumber || `Plot #${String(plot.id).slice(0, 6)}`}
                              </h3>
                            </div>
                            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 text-gold/60" />
                              <span className="truncate">{plot.areaName || plot.location || 'Kamareddy'}, {plot.villageName || 'Telangana'}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 pt-3 border-t border-border/50">
                            {plot.plotSize && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Ruler className="h-3.5 w-3.5 text-gold/60" />
                                <span>{plot.plotSize}</span>
                              </div>
                            )}
                            {plot.plotFacing && (
                              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <Compass className="h-3.5 w-3.5 text-gold/60" />
                                <span>{plot.plotFacing}</span>
                              </div>
                            )}
                          </div>

                          <div className="pt-2">
                            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold group-hover:gap-2.5 transition-all">
                              View Details 
                              <ArrowRight className="h-3.5 w-3.5" />
                            </span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}

            <FadeInUp delay={0.2} className="mt-12 text-center">
              <Button asChild size="lg" className="h-14 px-10 bg-gold hover:bg-gold-light text-black font-bold text-base rounded-xl shadow-lg shadow-gold/20">
                <Link href="/properties" className="flex items-center gap-2">
                  View All Properties
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </FadeInUp>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 4: WHY CHOOSE US
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-gold/5 to-transparent" />
            <div className="absolute bottom-0 left-1/3 w-1/3 h-px bg-gradient-to-r from-transparent via-gold/20 to-transparent" />
          </div>

          <div className="container px-4 relative z-10">
            <FadeInUp>
              <SectionHeader 
                badge="Why Choose Us"
                title="The AS Trusted Institutional Advantage"
                subtitle="We don't just sell plots — we architect legacy wealth through rigorous legal verification, data-driven market intelligence, and transparent processes."
              />
            </FadeInUp>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <StaggerChildren className="space-y-6">
                {[
                  {
                    icon: Shield,
                    title: 'Uncompromising Verification',
                    desc: 'Our legal team performs a 30-year link-document verification on every listing. Every title is insured, every document is notarized.'
                  },
                  {
                    icon: TrendingUp,
                    title: 'Data-Driven Intelligence',
                    desc: 'We source plots exclusively in zones with upcoming infrastructure catalysts, IT corridors, and confirmed development plans.'
                  },
                  {
                    icon: Target,
                    title: 'Strategic Location Selection',
                    desc: 'Each property is evaluated against 15+ growth parameters including proximity to highways, industrial hubs, and social infrastructure.'
                  },
                  {
                    icon: Eye,
                    title: 'Complete Transparency',
                    desc: 'From pricing to legal status, every detail is documented and accessible. No hidden charges, no ambiguous commitments.'
                  },
                ].map((item, i) => (
                  <StaggerItem key={i} className="group">
                    <div className="flex gap-5 p-5 rounded-2xl transition-all duration-300 hover:bg-white/[0.02] hover:border hover:border-gold/5">
                      <div className="shrink-0 w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center border border-gold/10 group-hover:bg-gold/15 group-hover:border-gold/20 transition-all">
                        <item.icon className="w-6 h-6 text-gold" />
                      </div>
                      <div className="space-y-1.5">
                        <h4 className="text-lg font-bold font-headline text-white">{item.title}</h4>
                        <p className="text-sm text-white/50 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerChildren>

              <FadeInUp delay={0.2}>
                <div className="relative">
                  <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-gold/10 shadow-2xl">
                    <Image
                      src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800"
                      alt="Luxury Architecture"
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />
                    
                    <div className="absolute bottom-6 left-6 right-6 p-6 bg-navy/80 backdrop-blur-xl rounded-xl border border-gold/10">
                      <p className="text-white/80 italic text-sm leading-relaxed">
                        &ldquo;We don&apos;t just sell plots; we architect legacy wealth through land intelligence and uncompromising trust.&rdquo;
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                        <div className="h-px w-8 bg-gold" />
                        <span className="text-gold text-[10px] font-bold uppercase tracking-widest">Sri Swamy, Founder</span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 5: INVESTMENT OPPORTUNITIES / ROI CALCULATOR
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />

          <div className="container px-4 relative z-10">
            <FadeInUp>
              <SectionHeader 
                badge="Investment Calculator"
                title="Calculate Your Wealth Trajectory"
                subtitle="See how your investment compounds with our proven growth model. Based on verified historical performance across our portfolio."
              />
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="max-w-4xl mx-auto">
                <div className="bg-card border border-gold/10 rounded-3xl p-8 md:p-10 shadow-xl shadow-gold/5">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-12">
                    {/* Input */}
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-3">
                          Your Investment Amount
                        </label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-gold">₹</span>
                          <input 
                            type="number" 
                            value={roiInput}
                            onChange={(e) => setRoiInput(e.target.value)}
                            className="w-full h-14 pl-10 pr-4 rounded-xl bg-background border border-border focus:border-gold/50 focus:ring-1 focus:ring-gold/30 text-lg font-bold text-foreground transition-all outline-none"
                            placeholder="10,00,000"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Based on 15% average annual appreciation
                        </p>
                      </div>

                      <div className="p-4 rounded-xl bg-gold/5 border border-gold/10">
                        <div className="flex items-center gap-2 text-sm text-gold font-semibold mb-2">
                          <Shield className="h-4 w-4" />
                          Verified Performance
                        </div>
                        <p className="text-xs text-muted-foreground/80">
                          Average returns based on 500+ verified property investments over the past 12 years.
                        </p>
                      </div>
                    </div>

                    {/* Results */}
                    <div className="space-y-4">
                      <p className="text-sm font-semibold text-foreground mb-4">Projected Returns</p>
                      {[
                        { label: 'After 1 Year', value: roi1yr, color: 'text-gold' },
                        { label: 'After 3 Years', value: roi3yr, color: 'text-emerald-500' },
                        { label: 'After 5 Years', value: roi5yr, color: 'text-blue-500' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-background border border-border/50 group hover:border-gold/20 transition-all">
                          <div>
                            <span className="text-sm text-muted-foreground">{item.label}</span>
                            <div className="flex items-center gap-2 mt-0.5">
                              <div className={`h-2 w-2 rounded-full ${item.color.replace('text-', 'bg-')}`} />
                              <span className="text-xs text-muted-foreground">
                                {i === 0 ? '+15%' : i === 1 ? '+52%' : '+101%'} return
                              </span>
                            </div>
                          </div>
                          <span className={`text-xl font-bold font-headline ${item.color}`}>
                            ₹{Math.round(item.value).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}

                      <div className="pt-4 border-t border-border/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">Investment</span>
                          <span className="font-bold text-foreground">₹{roiPrincipal.toLocaleString('en-IN')}</span>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-sm text-muted-foreground">5-Year Potential</span>
                          <span className="font-bold text-gold text-lg">₹{Math.round(roi5yr).toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.2} className="mt-12 text-center">
              <Button asChild size="lg" className="h-14 px-10 bg-gold hover:bg-gold-light text-black font-bold text-base rounded-xl shadow-lg shadow-gold/20">
                <Link href="/register" className="flex items-center gap-2">
                  Start Your Investment Journey
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </FadeInUp>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 6: MOTIVATIONAL INVESTMENT BOXES
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-navy text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none opacity-30" />
          
          <div className="container px-4 relative z-10">
            <FadeInUp>
              <SectionHeader 
                badge="Investment Philosophy"
                title="Capital Today, Tomorrow's Legacy"
                subtitle="Explore our strategic investment pathways designed for discerning investors seeking long-term wealth creation."
              />
            </FadeInUp>

            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[
                { href: '/capital-today-tomorrow', icon: TrendingUp, title: 'Capital Strategy', desc: 'Strategic timing for maximum appreciation in growth corridors', color: 'from-gold/20 to-gold/5', border: 'border-gold/20', textColor: 'text-gold' },
                { href: '/legacy-wealth', icon: Crown, title: 'Legacy Building', desc: 'Land investments that last generations and create family heritage', color: 'from-emerald-500/20 to-emerald-500/5', border: 'border-emerald-500/20', textColor: 'text-emerald-400' },
                { href: '/smart-investment', icon: BarChart3, title: 'AI Intelligence', desc: 'Data-driven decisions with AI-powered market insights', color: 'from-blue-500/20 to-blue-500/5', border: 'border-blue-500/20', textColor: 'text-blue-400' },
                { href: '/secure-future', icon: Shield, title: 'Bank Security', desc: '30-point legal verification with title insurance protection', color: 'from-amber-500/20 to-amber-500/5', border: 'border-amber-500/20', textColor: 'text-amber-400' },
                { href: '/exponential-growth', icon: TrendingUp, title: '3X Returns', desc: 'Compounding wealth with 25% annual growth potential', color: 'from-purple-500/20 to-purple-500/5', border: 'border-purple-500/20', textColor: 'text-purple-400' },
                { href: '/premium-club', icon: Crown, title: 'Elite Club', desc: 'VIP access to exclusive deals and personalized advisory', color: 'from-rose-500/20 to-rose-500/5', border: 'border-rose-500/20', textColor: 'text-rose-400' },
              ].map((box, i) => (
                <StaggerItem key={i}>
                  <Link href={box.href} className="group block h-full">
                    <Card className={`h-full overflow-hidden bg-gradient-to-br ${box.color} ${box.border} transition-all duration-500 hover:shadow-xl hover:shadow-gold/5 hover:-translate-y-1 cursor-pointer`}>
                      <CardContent className="p-6 md:p-8">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${box.color} flex items-center justify-center mb-5 border ${box.border} group-hover:scale-110 transition-transform duration-300`}>
                          <box.icon className={`h-6 w-6 ${box.textColor}`} />
                        </div>
                        <h3 className={`text-lg font-bold font-headline mb-2 ${box.textColor}`}>
                          {box.title}
                        </h3>
                        <p className="text-sm text-white/50 leading-relaxed">
                          {box.desc}
                        </p>
                        <div className="mt-5 flex items-center text-xs font-semibold text-white/30 group-hover:text-gold group-hover:gap-2 transition-all">
                          Explore <ChevronRight className="h-3.5 w-3.5" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 7: TESTIMONIALS
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-20 md:py-28 bg-background relative overflow-hidden">
          <div className="absolute inset-0 bg-mesh-dark pointer-events-none" />

          <div className="container px-4 relative z-10">
            <FadeInUp>
              <SectionHeader 
                badge="Client Success"
                title="What Our Investors Say"
                subtitle="Real stories from real investors who have achieved exceptional returns through strategic land investments with AS Trusted."
              />
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <div className="max-w-4xl mx-auto">
                {/* Featured Testimonial Card */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={testimonials[activeTestimonial].id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="border-gold/10 bg-gradient-to-br from-gold/[0.02] to-transparent shadow-xl">
                      <CardContent className="p-8 md:p-12">
                        <div className="grid md:grid-cols-5 gap-8 md:gap-12">
                          {/* Left - Investor Info */}
                          <div className="md:col-span-2 space-y-6">
                            <div className="flex items-center gap-4">
                              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold/30 to-gold/10 flex items-center justify-center text-gold font-bold text-xl border border-gold/20">
                                {testimonials[activeTestimonial].name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="font-bold text-lg text-foreground">{testimonials[activeTestimonial].name}</h3>
                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5" />
                                  {testimonials[activeTestimonial].location}
                                </p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              {[1,2,3,4,5].map((star) => (
                                <Star key={star} className="w-5 h-5 text-gold fill-gold" />
                              ))}
                            </div>

                            <div className="space-y-3">
                              <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Investment</span>
                                <span className="font-bold text-foreground">{testimonials[activeTestimonial].investment}</span>
                              </div>
                              <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Return</span>
                                <span className="font-bold text-emerald-500">{testimonials[activeTestimonial].roi}</span>
                              </div>
                              <div className="flex justify-between text-sm border-b border-border/50 pb-2">
                                <span className="text-muted-foreground">Timeline</span>
                                <span className="font-bold text-foreground">{testimonials[activeTestimonial].timeline}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Current Value</span>
                                <span className="font-bold text-gold text-lg">{testimonials[activeTestimonial].currentValue}</span>
                              </div>
                            </div>
                          </div>

                          {/* Right - Testimonial */}
                          <div className="md:col-span-3 flex flex-col justify-center">
                            <Quote className="h-10 w-10 text-gold/30 mb-6" />
                            <p className="text-lg md:text-xl leading-relaxed text-foreground/90 italic">
                              &ldquo;{testimonials[activeTestimonial].text}&rdquo;
                            </p>
                            <div className="mt-6 flex items-center gap-3">
                              <TrendingUp className="h-5 w-5 text-emerald-500" />
                              <span className="text-sm text-emerald-500 font-semibold">
                                Verified Investment
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>

                {/* Testimonial Navigation Dots */}
                <div className="flex justify-center gap-3 mt-8">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveTestimonial(i)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        i === activeTestimonial 
                          ? 'bg-gold w-8' 
                          : 'bg-border hover:bg-gold/50'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </FadeInUp>

            {/* Stats Grid */}
            <FadeInUp delay={0.2}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 max-w-4xl mx-auto">
                {[
                  { value: '79%', label: 'Average ROI', color: 'text-gold' },
                  { value: '2.5', label: 'Years Avg. Hold', color: 'text-emerald-500' },
                  { value: '100%', label: 'Client Satisfaction', color: 'text-blue-500' },
                  { value: '5.0', label: 'Star Rating', color: 'text-amber-500' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-5 rounded-2xl bg-card border border-border/50">
                    <div className={`text-2xl md:text-3xl font-bold font-headline ${stat.color}`}>{stat.value}</div>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           SECTION 8: CONTACT / INQUIRY CTA
           ═══════════════════════════════════════════════════════════ */}
        <section className="relative py-24 md:py-32 overflow-hidden bg-navy">
          {/* Background Effects */}
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 rounded-full blur-[150px]" />
            <div className="absolute inset-0 opacity-[0.03]" style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, rgba(212,175,55,0.3) 1px, transparent 0)`,
              backgroundSize: '40px 40px'
            }} />
          </div>

          <div className="container px-4 relative z-10 text-center">
            <FadeInUp>
              <Badge className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                Start Your Journey
              </Badge>
            </FadeInUp>

            <FadeInUp delay={0.1}>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline text-white leading-[1.1] max-w-4xl mx-auto">
                Ready to Invest in{' '}
                <span className="text-gradient-gold">Strategic Land</span>
                ?
              </h2>
            </FadeInUp>

            <FadeInUp delay={0.2}>
              <p className="mt-6 text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                Join 500+ discerning investors who trust AS Trusted for premium land investments. 
                Schedule a consultation or visit our properties today.
              </p>
            </FadeInUp>

            <FadeInUp delay={0.3}>
              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <Button asChild size="lg" className="h-14 px-10 bg-gold hover:bg-gold-light text-black font-bold text-base rounded-xl shadow-xl shadow-gold/30 hover:shadow-gold/40 transition-all duration-300">
                  <Link href="/properties" className="flex items-center gap-2">
                    Browse Properties
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-14 px-10 border-white/20 text-white hover:bg-white/5 hover:border-gold/30 font-semibold text-base rounded-xl transition-all duration-300">
                  <Link href="/book-site-visit" className="flex items-center gap-2">
                    <CalendarCheck className="h-5 w-5" />
                    Schedule Visit
                  </Link>
                </Button>
              </div>
            </FadeInUp>

            <FadeInUp delay={0.4}>
              <div className="flex flex-wrap justify-center gap-6 mt-16">
                {[
                  { icon: Phone, text: '+91 98664 04090', href: 'tel:+919866404090' },
                  { icon: Mail, text: 'swamygoud2775@gmail.com', href: 'mailto:swamygoud2775@gmail.com' },
                  { icon: MapPin, text: 'Kamareddy, Telangana', href: 'https://maps.google.com' },
                ].map((item, i) => (
                  <Link key={i} href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-5 py-3 rounded-xl bg-white/[0.03] border border-white/5 hover:bg-gold/5 hover:border-gold/15 transition-all group">
                    <item.icon className="h-5 w-5 text-gold/70 group-hover:text-gold transition-colors" />
                    <span className="text-sm text-white/50 group-hover:text-white/80 transition-colors">{item.text}</span>
                  </Link>
                ))}
              </div>
            </FadeInUp>
          </div>
        </section>
        <FinancialAssistance />
        <WhyKamareddy />
        <Testimonials />
        <TelanganaSeoSection />
        <Footer />
      </main>
    </div>
  );
}
