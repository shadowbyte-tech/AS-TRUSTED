'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'framer-motion';
import { 
  Building2, 
  Wallet, 
  GraduationCap, 
  Landmark, 
  FileText, 
  Clock, 
  Users, 
  HeadphonesIcon,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

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

export default function FinancialAssistance() {
  const services = [
    {
      title: 'Home Loan Assistance',
      description: 'We assist clients in securing competitive home loans with trusted banking partners for faster and smoother property ownership.',
      icon: Building2,
      features: [
        'Home Purchase Loans',
        'Plot Purchase Loans',
        'Construction Loans',
        'Renovation Financing',
        'Loan Documentation Guidance',
        'Balance Transfer Support'
      ],
      cta: 'Get Home Loan Assistance',
    },
    {
      title: 'Personal Loan Assistance',
      description: 'Quick and reliable personal loan assistance with simplified documentation guidance and trusted financial support.',
      icon: Wallet,
      features: [
        'Emergency Funding Support',
        'Medical Expense Assistance',
        'Business Financial Support',
        'Flexible Financing Guidance',
        'Fast Documentation Help',
        'Trusted Banking Partners'
      ],
      cta: 'Talk to an Advisor',
    },
    {
      title: 'Education Loan Assistance',
      description: 'Guidance and support for educational loans to help students achieve their academic and career goals.',
      icon: GraduationCap,
      features: [
        'Indian University Loans',
        'Abroad Education Support',
        'Professional Course Financing',
        'Student Financial Guidance',
        'Parent Co-Applicant Assistance',
        'Simplified Loan Consultation'
      ],
      cta: 'Get Education Loan Support',
    }
  ];

  const features = [
    { icon: Landmark, title: 'Trusted Banking Partners' },
    { icon: ShieldCheck, title: 'Transparent Guidance' },
    { icon: FileText, title: 'End-to-End Documentation Support' },
    { icon: Clock, title: 'Fast Consultation Process' },
    { icon: Users, title: 'Personalized Financial Assistance' },
    { icon: HeadphonesIcon, title: 'Professional Client Support' },
  ];

  return (
    <section className="py-20 md:py-28 bg-navy relative overflow-hidden text-white border-y border-gold/5">
      {/* Background Styling */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-mesh-dark opacity-50" />
      </div>

      <div className="container px-4 relative z-10">
        <FadeInUp className="text-center mb-16">
          <Badge className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
            <Landmark className="h-3.5 w-3.5" />
            Financial & Loan Assistance Services
          </Badge>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tight max-w-4xl mx-auto text-white">
            Helping clients secure <span className="text-gradient-gold">trusted financing solutions</span>
          </h2>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Guidance and support for property purchases, education, and personal financial needs through reliable banking and financial partners.
          </p>
        </FadeInUp>

        {/* Stats / Counters */}
        <FadeInUp delay={0.2} className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { value: 500, suffix: '+', label: 'Assisted Clients' },
              { value: 100, suffix: '%', label: 'Trusted Financial Guidance' },
              { value: 24, suffix: 'h', label: 'Fast Documentation Support' },
            ].map((stat, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center backdrop-blur-md">
                <div className="text-3xl md:text-4xl font-bold font-headline text-gold mb-2">
                  <CountUp end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm font-semibold text-white/80 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </FadeInUp>

        {/* Service Cards */}
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <StaggerItem key={index} className="h-full">
              <Card className="h-full bg-navy border border-gold/10 hover:border-gold/30 transition-all duration-500 hover:shadow-xl hover:shadow-gold/10 hover:-translate-y-2 group overflow-hidden relative">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <service.icon className="w-32 h-32 text-gold" />
                </div>
                <CardContent className="p-8 relative z-10 flex flex-col h-full">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-500">
                    <service.icon className="w-6 h-6 text-gold" />
                  </div>
                  
                  <h3 className="text-2xl font-bold font-headline text-white mb-4 group-hover:text-gold transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-white/60 mb-8 flex-grow">
                    {service.description}
                  </p>
                  
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="mt-1 bg-gold/20 rounded-full p-0.5">
                          <ChevronRight className="w-3 h-3 text-gold" />
                        </div>
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button asChild className="w-full bg-white/5 hover:bg-gold text-white hover:text-black border border-white/10 hover:border-gold transition-all duration-300">
                    <a href="tel:+919866404090">
                      {service.cta}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerChildren>

        {/* Why Choose Us */}
        <div className="mt-24">
          <FadeInUp>
            <div className="text-center mb-12">
              <h3 className="text-2xl md:text-4xl font-bold font-headline text-white">
                Why Choose Our Financial Assistance Services
              </h3>
            </div>
          </FadeInUp>
          
          <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {features.map((feature, index) => (
              <StaggerItem key={index}>
                <div className="bg-background/40 backdrop-blur-sm border border-gold/10 rounded-2xl p-6 text-center hover:bg-gold/5 hover:border-gold/30 transition-all duration-300 h-full flex flex-col items-center justify-center gap-4 group">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className="w-5 h-5 text-gold" />
                  </div>
                  <span className="text-sm font-semibold text-white/90 leading-tight">
                    {feature.title}
                  </span>
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>

        {/* Action Button */}
        <FadeInUp delay={0.3} className="mt-16 mb-8 flex justify-center">
          <Button asChild className="bg-gold hover:bg-gold-light text-black shadow-xl shadow-gold/30 rounded-full px-8 py-6 text-lg font-bold flex items-center gap-2 group transition-all duration-300 hover:scale-105">
            <a href="tel:+919866404090">
              <MessageSquare className="w-5 h-5 group-hover:animate-bounce" />
              <span>Request Financial Consultation</span>
            </a>
          </Button>
        </FadeInUp>

        {/* Disclaimer */}
        <FadeInUp delay={0.4} className="mt-8 text-center">
          <p className="text-xs text-white/40 max-w-2xl mx-auto bg-white/5 py-3 px-6 rounded-full border border-white/10">
            Disclaimer: Loan approvals are subject to eligibility and partner financial institution policies. We provide consultancy and assistance, not direct lending.
          </p>
        </FadeInUp>
      </div>
    </section>
  );
}
