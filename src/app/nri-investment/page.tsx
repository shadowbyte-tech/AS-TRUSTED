'use client';

import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Globe, 
  Shield, 
  FileText, 
  CreditCard, 
  Phone, 
  Mail,
  CheckCircle,
  ArrowRight,
  Users,
  Building,
  TrendingUp,
  Lock,
  Plane,
  Home,
  Banknote,
  Calculator
} from 'lucide-react';

export default function NRIInvestmentPage() {
  const benefits = [
    {
      title: "High ROI Potential",
      description: "Telangana real estate offers 15-22% annual returns",
      icon: TrendingUp,
      color: "text-emerald-600"
    },
    {
      title: "Government Support",
      description: "NRI-friendly policies and single-window clearance",
      icon: Shield,
      color: "text-blue-600"
    },
    {
      title: "Legal Protection",
      description: "Complete documentation verification and legal compliance",
      icon: FileText,
      color: "text-purple-600"
    },
    {
      title: "Easy Repatriation",
      description: "Hassle-free fund repatriation and investment returns",
      icon: CreditCard,
      color: "text-amber-600"
    }
  ];

  const process = [
    {
      step: 1,
      title: "Property Selection",
      description: "Choose from verified DTCP-approved plots with clear titles",
      icon: Home
    },
    {
      step: 2,
      title: "Documentation",
      description: "Complete legal verification and documentation assistance",
      icon: FileText
    },
    {
      step: 3,
      title: "Payment Process",
      description: "Secure international payment options and NRI accounts",
      icon: CreditCard
    },
    {
      step: 4,
      title: "Registration",
      description: "Online registration and digital document delivery",
      icon: CheckCircle
    }
  ];

  const paymentMethods = [
    {
      name: "NRE Account",
      description: "Non-Resident External account for tax-free investments",
      features: ["Tax-free interest", "Repatriation allowed", "Joint accounts permitted"]
    },
    {
      name: "NRO Account",
      description: "Non-Resident Ordinary account for Indian income",
      features: ["Taxable income", "Easy fund transfers", "Multiple currency support"]
    },
    {
      name: "FCNR Account",
      description: "Foreign Currency Non-Resident account for fixed deposits",
      features: ["Currency protection", "Higher interest rates", "Flexible tenure"]
    },
    {
      name: "Direct Payment",
      description: "International wire transfer and online payment options",
      features: ["SWIFT transfers", "Online gateways", "Multi-currency support"]
    }
  ];

  const requiredDocuments = [
    {
      name: "Passport & Visa",
      description: "Valid passport copy and current visa details",
      mandatory: true
    },
    {
      name: "PAN Card",
      description: "Permanent Account Number for tax purposes",
      mandatory: true
    },
    {
      name: "Address Proof",
      description: "Overseas address proof and utility bills",
      mandatory: true
    },
    {
      name: "Income Proof",
      description: "Income statements and bank statements",
      mandatory: false
    },
    {
      name: "Power of Attorney",
      description: "Optional POA for local representation",
      mandatory: false
    },
    {
      name: "OCI Card",
      description: "Overseas Citizen of India card (if applicable)",
      mandatory: false
    }
  ];

  const nriStats = [
    {
      value: "25%",
      label: "NRI Investors",
      description: "Of our total investor base"
    },
    {
      value: "₹850L",
      label: "Total NRI Investment",
      description: "In the last 2 years"
    },
    {
      value: "18%",
      label: "Higher ROI",
      description: "Average NRI investment returns"
    },
    {
      value: "12",
      label: "Countries",
      description: "NRI investors from 12+ countries"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      {/* Hero Section */}
      <div className="container px-4 py-16">
        <div className="text-center space-y-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-4">
            <Globe className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-600">NRI Investment</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black font-headline tracking-tighter">
            Invest from <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">Anywhere</span> in the World
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Complete guide for NRIs to invest in Telangana real estate. 
            Secure, transparent, and hassle-free investment process with international support.
          </p>
        </div>

        {/* NRI Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {nriStats.map((stat, index) => (
            <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-black text-primary mb-2">{stat.value}</div>
                <div className="font-medium mb-1">{stat.label}</div>
                <div className="text-sm text-muted-foreground">{stat.description}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Why NRIs Choose Telangana Real Estate</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background hover:scale-[1.02] transition-all duration-500">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className={`h-8 w-8 ${benefit.color}`} />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                  <p className="text-muted-foreground text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Investment Process */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Simple 4-Step Investment Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background relative">
                <CardContent className="p-6">
                  <div className="absolute top-4 right-4 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {step.step}
                  </div>
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center mb-4">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Payment Methods */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Flexible Payment Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
                      <Banknote className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{method.name}</h3>
                      <p className="text-muted-foreground text-sm">{method.description}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {method.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Required Documents */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold font-headline text-center mb-12">Required Documentation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {requiredDocuments.map((doc, index) => (
              <Card key={index} className="border-primary/20 bg-gradient-to-br from-background via-primary/5 to-background">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center flex-shrink-0 mt-1">
                      <FileText className="h-5 w-5 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold">{doc.name}</h3>
                        {doc.mandatory && (
                          <Badge className="bg-red-500 text-white text-xs">Required</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">{doc.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Legal Process */}
        <div className="mb-16">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-accent/5 to-primary/10">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-3xl font-bold font-headline mb-6">Legal Process & Compliance</h2>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Shield className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">Title Verification</h3>
                        <p className="text-muted-foreground text-sm">Complete legal title verification and encumbrance check</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Lock className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">Secure Registration</h3>
                        <p className="text-muted-foreground text-sm">Online registration with digital document delivery</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calculator className="h-5 w-5 text-primary mt-1" />
                      <div>
                        <h3 className="font-bold mb-1">Tax Compliance</h3>
                        <p className="text-muted-foreground text-sm">Complete tax guidance and compliance assistance</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <Card className="border-primary/20">
                    <CardContent className="p-6">
                      <h3 className="font-bold mb-4">Investment Protection</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">RERA compliant projects</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">DTCP approved plots only</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">Clear marketable titles</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-emerald-500" />
                          <span className="text-sm">No litigation properties</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-primary/20 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-blue-500/10 p-8 text-center">
          <div className="max-w-2xl mx-auto space-y-6">
            <Plane className="h-12 w-12 text-blue-500 mx-auto" />
            <h2 className="text-3xl font-bold font-headline">
              Start Your NRI Investment Journey
            </h2>
            <p className="text-muted-foreground">
              Join thousands of NRIs investing in Telangana's booming real estate market. 
              Get personalized assistance and exclusive NRI benefits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-500/90 hover:to-purple-500/90">
                <Users className="h-4 w-4 mr-2" />
                Schedule NRI Consultation
              </Button>
              <Button variant="outline" className="border-primary/20">
                <Phone className="h-4 w-4 mr-2" />
                Call NRI Support
              </Button>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+91 98664 04090</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>nri@as-trusted.com</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Footer />
    </div>
  );
}
