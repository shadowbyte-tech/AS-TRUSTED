'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, 
  Zap, 
  Crown, 
  Star, 
  Check, 
  CreditCard, 
  Shield, 
  TrendingUp,
  Sparkles,
  Rocket,
  Gem
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function AIAccessPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hasAIAccess, setHasAIAccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const plans = {
    monthly: {
      price: 199,
      period: 'per month',
      features: [
        'AI Property Descriptions',
        'AI VASTU Analysis',
        'AI Price Predictions',
        'AI Investment Recommendations',
        'AI Market Insights',
      ],
      popular: false,
    },
    yearly: {
      price: 1999,
      period: 'per year',
      features: [
        'Everything in monthly plan',
        'Save 17% compared to monthly',
        'AI Property Comparison',
        'AI Legal Document Analysis',
        'AI Neighborhood Insights',
        'AI Rental Yield Calculator',
        'AI Risk Assessment',
        'Priority AI Processing',
      ],
      popular: true,
    },
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    // Check if user already has AI access
    const checkAIAccess = async () => {
      try {
        const response = await fetch('/api/ai-access/check', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userEmail: user.email })
        });
        
        if (response.ok) {
          const data = await response.json();
          setHasAIAccess(data.hasAIAccess);
        }
      } catch (error) {
        console.error('Failed to check AI access:', error);
      }
    };

    checkAIAccess();
  }, [user]);

  const handlePurchaseAI = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Integrate with payment gateway
      // 2. Process payment
      // 3. Update user's AI access status
      // 4. Send confirmation
      
      alert('AI Access purchased successfully! Welcome to Premium AI Features!');
      setHasAIAccess(true);
      router.push('/ai-dashboard');
    } catch (error) {
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Brain className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">AI Features Access</h1>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-4">
                <Shield className="h-16 w-16 text-muted-foreground mx-auto" />
                <h2 className="text-2xl font-semibold">Premium AI Features</h2>
                <p className="text-muted-foreground">
                  Login to access powerful AI features for property analysis and insights.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/user-login">Login to Access AI</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link href="/register">Create Account</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (hasAIAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Brain className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">AI Access Active</h1>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold">You Have AI Access!</h2>
                <p className="text-muted-foreground">
                  Enjoy exclusive AI features for property analysis and insights.
                </p>
                <Button asChild className="w-full">
                  <Link href="/ai-dashboard">Go to AI Dashboard</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
      <Header />
      
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center space-y-6 mb-16">
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Unlock Premium AI Features</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get access to cutting-edge AI technology for property analysis, VASTU insights, and investment recommendations.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          {Object.entries(plans).map(([planType, plan]) => (
            <Card 
              key={planType}
              className={`relative overflow-hidden ${
                plan.popular 
                  ? 'border-primary shadow-2xl scale-105' 
                  : 'border-border'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-sm font-semibold">
                  POPULAR
                </div>
              )}
              
              <CardHeader className="text-center pb-4">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Brain className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl capitalize">{planType} AI Plan</CardTitle>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {planType === 'yearly' && (
                    <Badge variant="secondary">Save ₹389 compared to monthly</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                <Button 
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-white shadow-lg"
                  onClick={() => handlePurchaseAI(planType as 'monthly' | 'yearly')}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Purchase {planType.charAt(0).toUpperCase() + planType.slice(1)} AI
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">AI Property Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Get instant AI-powered property descriptions and insights
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <Star className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">VASTU Analysis</h3>
              <p className="text-sm text-muted-foreground">
                Traditional VASTU principles combined with AI technology
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-0 shadow-lg">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold">Investment Insights</h3>
              <p className="text-sm text-muted-foreground">
                AI-driven investment recommendations and market predictions
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Trust Badges */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Shield className="h-5 w-5" />
            <span>Secure Payment Processing</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Check className="h-5 w-5" />
            <span>30-Day Money Back Guarantee</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <Gem className="h-5 w-5" />
            <span>Premium AI Technology</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
