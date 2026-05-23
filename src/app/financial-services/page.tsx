import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Wallet, GraduationCap, Landmark, FileText, CheckCircle2, ArrowRight, ShieldCheck, Clock, Users, Phone } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Financial & Loan Assistance Services | AS Trusted',
  description: 'Detailed information about our Home, Personal, and Education Loan assistance services through trusted banking partners.',
};

export default function FinancialServicesPage() {
  const services = [
    {
      id: 'home-loan',
      title: 'Home Loan Assistance',
      icon: Building2,
      description: 'We assist clients in securing competitive home loans with trusted banking partners for faster and smoother property ownership. Whether you are buying an open plot, an apartment, or constructing your dream home, our expert team guides you through the entire financing process.',
      eligibility: [
        'Salaried professionals with a minimum of 2 years experience',
        'Self-employed individuals with stable business income (3 years ITR)',
        'Good credit score (CIBIL 750+ preferred)',
        'Co-applicant optional but recommended for higher eligibility'
      ],
      documents: [
        'Identity & Address Proof (Aadhaar, PAN, Passport)',
        'Last 6 months salary slips or 3 years ITR',
        'Last 6 months bank statements',
        'Property documents (Allotment letter, Agreement of Sale)'
      ]
    },
    {
      id: 'personal-loan',
      title: 'Personal Loan Assistance',
      icon: Wallet,
      description: 'Quick and reliable personal loan assistance with simplified documentation guidance. Whether you need funds for a medical emergency, a wedding, home renovation, or business expansion, we connect you with the right financial institutions for fast approvals.',
      eligibility: [
        'Minimum monthly net income of ₹25,000',
        'Age between 21 and 58 years',
        'Minimum 1 year of continuous employment',
        'No major defaults in recent credit history'
      ],
      documents: [
        'Identity & Address Proof',
        'Last 3 months salary slips',
        'Last 6 months bank statements',
        'Employment proof or business continuation proof'
      ]
    },
    {
      id: 'education-loan',
      title: 'Education Loan Assistance',
      icon: GraduationCap,
      description: 'Comprehensive guidance and support for educational loans to help students achieve their academic and career goals. We cover loans for domestic universities as well as abroad studies with structured repayment plans.',
      eligibility: [
        'Confirmed admission in a recognized university/institution',
        'Co-applicant (parent/guardian) with a stable income',
        'Collateral may be required for loans exceeding certain limits',
        'Strong academic record of the student'
      ],
      documents: [
        'Admission letter and fee structure',
        'Student\'s academic records (10th, 12th, Degree marksheets)',
        'Co-applicant\'s income proof (Salary slips/ITR)',
        'Collateral documents (if applicable)'
      ]
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />

      <main className="flex-1 pt-[80px]">
        {/* Hero Section */}
        <section className="relative py-20 md:py-32 bg-navy overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[120px]" />
            <div className="absolute inset-0 bg-mesh-dark opacity-30 pointer-events-none" />
          </div>
          <div className="container px-4 relative z-10 text-center">
            <Badge className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/10 border border-gold/20 text-gold text-xs font-bold uppercase tracking-widest mb-6">
              <Landmark className="h-3.5 w-3.5" />
              Comprehensive Financial Support
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-headline text-white leading-tight max-w-4xl mx-auto mb-6">
              Expert <span className="text-gradient-gold">Loan Assistance</span> & Consultancy
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto leading-relaxed">
              We provide end-to-end guidance to help you secure the right financing from trusted banking partners with transparent and hassle-free processes.
            </p>
          </div>
        </section>

        {/* Details Section */}
        <section className="py-20 bg-background relative">
          <div className="container px-4">
            <div className="space-y-24">
              {services.map((service, index) => (
                <div key={service.id} id={service.id} className="scroll-mt-32">
                  <div className={`flex flex-col lg:flex-row gap-12 ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}>
                    
                    {/* Content */}
                    <div className="lg:w-1/2 space-y-6">
                      <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/20 flex items-center justify-center mb-6">
                        <service.icon className="w-8 h-8 text-gold" />
                      </div>
                      <h2 className="text-3xl md:text-4xl font-bold font-headline text-foreground">
                        {service.title}
                      </h2>
                      <p className="text-lg text-muted-foreground leading-relaxed">
                        {service.description}
                      </p>
                      
                      <div className="pt-6 grid sm:grid-cols-2 gap-8">
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                            Eligibility Criteria
                          </h4>
                          <ul className="space-y-3">
                            {service.eligibility.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                            <FileText className="w-5 h-5 text-blue-500" />
                            Required Documents
                          </h4>
                          <ul className="space-y-3">
                            {service.documents.map((item, idx) => (
                              <li key={idx} className="flex items-start gap-3">
                                <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                                <span className="text-sm text-muted-foreground">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    {/* Card/Image Area */}
                    <div className="lg:w-1/2">
                      <Card className="h-full bg-card border border-border shadow-xl overflow-hidden relative group">
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-8 md:p-12 h-full flex flex-col justify-center relative z-10">
                          <h3 className="text-2xl font-bold font-headline mb-4">Start Your {service.title} Process Today</h3>
                          <p className="text-muted-foreground mb-8">
                            Skip the confusing paperwork. Our dedicated consultants will review your profile and connect you with the right banking partners for optimal interest rates and terms.
                          </p>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center">
                                <Clock className="w-5 h-5 text-gold" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">Fast Processing</p>
                                <p className="text-xs text-muted-foreground">Minimal turnaround time</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 p-4 rounded-xl bg-background border border-border">
                              <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                                <Users className="w-5 h-5 text-emerald-500" />
                              </div>
                              <div>
                                <p className="font-bold text-sm">Dedicated Agent</p>
                                <p className="text-xs text-muted-foreground">1-on-1 personalized guidance</p>
                              </div>
                            </div>
                          </div>
                          
                          <Button asChild size="lg" className="w-full mt-8 bg-gold hover:bg-gold-light text-black font-bold h-14 text-base rounded-xl">
                            <a href="tel:+919866404090">
                              <Phone className="w-5 h-5 mr-2" />
                              Talk to a Consultant Now
                            </a>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy text-center border-t border-gold/10">
          <div className="container px-4">
            <h2 className="text-3xl md:text-5xl font-bold font-headline text-white mb-6">Need clarity on your financial options?</h2>
            <p className="text-white/60 mb-10 max-w-2xl mx-auto">
              Our experts are ready to evaluate your requirements and offer the most viable financial guidance without any obligations.
            </p>
            <Button asChild size="lg" className="bg-gold hover:bg-gold-light text-black font-bold h-14 px-10 rounded-full shadow-xl shadow-gold/20">
              <a href="tel:+919866404090" className="flex items-center gap-2">
                Get a Free Consultation
                <ArrowRight className="w-5 h-5" />
              </a>
            </Button>
            
            <p className="mt-10 text-xs text-white/30 max-w-xl mx-auto">
              Disclaimer: AS Trusted provides consultancy and assistance for financial services. We act as facilitators between clients and established banking institutions. All loan approvals are strictly subject to the eligibility criteria and policies of the respective banks/NBFCs.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
