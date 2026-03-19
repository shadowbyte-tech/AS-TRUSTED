'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Check, 
  X, 
  Crown, 
  Star, 
  TrendingUp, 
  Shield, 
  Zap,
  BarChart3,
  Sparkles,
  HeadphonesIcon,
  Users,
  FileText,
  Globe,
  Lock,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  free: boolean | 'limited';
  premium: boolean;
  category: 'analytics' | 'ai-tools' | 'support' | 'data' | 'access';
}

export default function PremiumComparison() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [hoveredPlan, setHoveredPlan] = useState<'free' | 'premium' | null>(null);

  const features: Feature[] = [
    // Analytics Features
    { 
      icon: <BarChart3 className="h-5 w-5" />, 
      title: "Basic Analytics", 
      description: "Simple property insights and views", 
      free: true, 
      premium: true,
      category: 'analytics'
    },
    { 
      icon: <TrendingUp className="h-5 w-5" />, 
      title: "Advanced Analytics", 
      description: "Deep market analysis and trends", 
      free: false, 
      premium: true,
      category: 'analytics'
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      title: "Custom Reports", 
      description: "Generate detailed property reports", 
      free: 'limited', 
      premium: true,
      category: 'analytics'
    },
    
    // AI Tools
    { 
      icon: <Sparkles className="h-5 w-5" />, 
      title: "Basic Recommendations", 
      description: "Simple property suggestions", 
      free: 'limited', 
      premium: true,
      category: 'ai-tools'
    },
    { 
      icon: <Zap className="h-5 w-5" />, 
      title: "AI-Powered Analysis", 
      description: "Advanced AI insights and predictions", 
      free: false, 
      premium: true,
      category: 'ai-tools'
    },
    { 
      icon: <TrendingUp className="h-5 w-5" />, 
      title: "ROI Calculator", 
      description: "Advanced investment analysis", 
      free: false, 
      premium: true,
      category: 'ai-tools'
    },
    
    // Support
    { 
      icon: <HeadphonesIcon className="h-5 w-5" />, 
      title: "Email Support", 
      description: "Get help via email", 
      free: true, 
      premium: true,
      category: 'support'
    },
    { 
      icon: <Shield className="h-5 w-5" />, 
      title: "Priority Support", 
      description: "24/7 dedicated customer service", 
      free: false, 
      premium: true,
      category: 'support'
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      title: "Expert Consultation", 
      description: "Personalized investment advice", 
      free: false, 
      premium: true,
      category: 'support'
    },
    
    // Data & Access
    { 
      icon: <Globe className="h-5 w-5" />, 
      title: "Property Listings", 
      description: "Access to all property listings", 
      free: true, 
      premium: true,
      category: 'data'
    },
    { 
      icon: <FileText className="h-5 w-5" />, 
      title: "Data Export", 
      description: "Export data to Excel/PDF", 
      free: false, 
      premium: true,
      category: 'data'
    },
    { 
      icon: <Lock className="h-5 w-5" />, 
      title: "API Access", 
      description: "Integrate with your tools", 
      free: false, 
      premium: true,
      category: 'data'
    },
    
    // Additional Features
    { 
      icon: <Zap className="h-5 w-5" />, 
      title: "Priority Access", 
      description: "Be first to know about new properties", 
      free: false, 
      premium: true,
      category: 'access'
    },
    { 
      icon: <Crown className="h-5 w-5" />, 
      title: "Premium Badge", 
      description: "Show your premium status", 
      free: false, 
      premium: true,
      category: 'access'
    },
    { 
      icon: <Users className="h-5 w-5" />, 
      title: "Advanced Search", 
      description: "Powerful filters and search", 
      free: 'limited', 
      premium: true,
      category: 'access'
    }
  ];

  const monthlyPrice = 999;
  const yearlyPrice = 999 * 10; // 2 months free
  const discount = Math.round(((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) * 100);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'analytics': return 'from-blue-500 to-purple-500';
      case 'ai-tools': return 'from-purple-500 to-pink-500';
      case 'support': return 'from-green-500 to-teal-500';
      case 'data': return 'from-orange-500 to-red-500';
      case 'access': return 'from-indigo-500 to-blue-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-2">
          <Crown className="h-8 w-8 text-amber-500" />
          <h2 className="text-3xl font-bold">Choose Your Plan</h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan for your property investment needs. Upgrade anytime to unlock premium features.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4">
          <span className={cn('font-medium', billingCycle === 'monthly' ? 'text-foreground' : 'text-muted-foreground')}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2"
          >
            <span
              className={cn(
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
              )}
            />
          </button>
          <span className={cn('font-medium', billingCycle === 'yearly' ? 'text-foreground' : 'text-muted-foreground')}>
            Yearly
          </span>
          {billingCycle === 'yearly' && (
            <Badge className="bg-green-500 text-white">
              Save {discount}%
            </Badge>
          )}
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {/* Free Plan */}
        <Card 
          className={cn(
            'relative transition-all duration-300',
            hoveredPlan === 'free' ? 'shadow-xl scale-105' : 'shadow-md',
            hoveredPlan === 'premium' && 'opacity-75'
          )}
          onMouseEnter={() => setHoveredPlan('free')}
          onMouseLeave={() => setHoveredPlan(null)}
        >
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              Free
              <Badge variant="outline">Popular</Badge>
            </CardTitle>
            <CardDescription>Perfect for getting started</CardDescription>
            <div className="space-y-2">
              <div className="text-4xl font-bold">₹0</div>
              <div className="text-sm text-muted-foreground">Forever free</div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button className="w-full" variant="outline" disabled>
              Current Plan
            </Button>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {feature.free === true ? (
                      <div className="p-1 rounded-full bg-green-100">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    ) : feature.free === 'limited' ? (
                      <div className="p-1 rounded-full bg-amber-100">
                        <div className="h-3 w-3 text-amber-600 text-xs font-bold text-center">L</div>
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-gray-100">
                        <X className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Premium Plan */}
        <Card 
          className={cn(
            'relative transition-all duration-300 border-gradient-to-r from-amber-500 to-orange-500',
            hoveredPlan === 'premium' ? 'shadow-xl scale-105' : 'shadow-lg',
            hoveredPlan === 'free' && 'opacity-75'
          )}
          onMouseEnter={() => setHoveredPlan('premium')}
          onMouseLeave={() => setHoveredPlan(null)}
        >
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2 text-sm font-bold">
              RECOMMENDED
            </Badge>
          </div>
          
          <CardHeader className="text-center pb-4 pt-6">
            <CardTitle className="text-xl flex items-center justify-center gap-2">
              Premium
              <Crown className="h-5 w-5 text-amber-500" />
            </CardTitle>
            <CardDescription>Unlock everything</CardDescription>
            <div className="space-y-2">
              <div className="text-4xl font-bold">
                ₹{billingCycle === 'monthly' ? monthlyPrice : yearlyPrice}
              </div>
              <div className="text-sm text-muted-foreground">
                {billingCycle === 'monthly' ? 'per month' : 'per year (save 2 months)'}
              </div>
              {billingCycle === 'yearly' && (
                <Badge className="bg-green-500 text-white text-xs">
                  Save ₹{monthlyPrice * 2}
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
              onClick={() => window.location.href = '/premium'}
            >
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {feature.premium ? (
                      <div className="p-1 rounded-full bg-green-100">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                    ) : (
                      <div className="p-1 rounded-full bg-gray-100">
                        <X className="h-3 w-3 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-sm">{feature.title}</div>
                    <div className="text-xs text-muted-foreground">{feature.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feature Categories */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-center">Feature Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {['analytics', 'ai-tools', 'support', 'data', 'access'].map((category) => {
            const categoryFeatures = features.filter(f => f.category === category);
            const icon = categoryFeatures[0]?.icon;
            
            return (
              <Card key={category} className="border-l-4 border-l-gradient-to-r bg-gradient-to-r from-gray-50 to-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getCategoryColor(category)} text-white`}>
                      {icon}
                    </div>
                    <CardTitle className="text-lg capitalize">
                      {category.replace('-', ' ')}
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categoryFeatures.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <Check className="h-3 w-3 text-green-500" />
                        <span>{feature.title}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold text-amber-900 mb-2">What Our Premium Members Say</h3>
          <div className="flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star key={star} className="h-5 w-5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm italic text-gray-700 mb-2">
              "The advanced analytics helped me identify properties with 40% better ROI. Premium paid for itself in the first month!"
            </p>
            <p className="text-xs text-gray-500 font-medium">- Ramesh Kumar, Real Estate Investor</p>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <p className="text-sm italic text-gray-700 mb-2">
              "AI-powered tools are game-changing. I save hours of research time and make better investment decisions."
            </p>
            <p className="text-xs text-gray-500 font-medium">- Priya Sharma, Property Developer</p>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <div className="text-center space-y-4">
        <h3 className="text-2xl font-bold">Ready to Upgrade?</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join thousands of successful investors who use Premium features to make smarter property decisions.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
            onClick={() => window.location.href = '/premium'}
          >
            <Crown className="h-5 w-5 mr-2" />
            Start Premium Trial
          </Button>
          <Button size="lg" variant="outline">
            Schedule Demo
          </Button>
        </div>
        
        <p className="text-xs text-muted-foreground">
          No credit card required • Cancel anytime • 24/7 support
        </p>
      </div>
    </div>
  );
}
