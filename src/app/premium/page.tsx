'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Star, Check, Lock, CreditCard, Shield, Zap, Users, Eye } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';

export default function PremiumPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const plans = {
    monthly: {
      price: 299,
      period: 'per month',
      features: [
        'Access to premium properties',
        'Advanced search filters',
        'Property comparison tools',
        'Priority customer support',
        'Monthly market reports',
      ],
      popular: false,
    },
    yearly: {
      price: 2999,
      period: 'per year',
      features: [
        'Everything in monthly plan',
        'Save 17% compared to monthly',
        'Exclusive early access to new properties',
        'Virtual property tours',
        'Detailed investment analysis',
        'One-on-one consultation calls',
        'Premium property alerts',
      ],
      popular: true,
    },
  };

  const handlePurchase = async (plan: 'monthly' | 'yearly') => {
    setLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real implementation, you would:
      // 1. Integrate with a payment gateway (Razorpay, Stripe, etc.)
      // 2. Process the payment
      // 3. Update user's premium status in database
      // 4. Send confirmation email
      
      alert('Premium access purchased successfully! Welcome to Premium!');
      router.push('/premium-dashboard');
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
              <Crown className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">Premium Access</h1>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-4">
                <Lock className="h-16 w-16 text-muted-foreground mx-auto" />
                <h2 className="text-2xl font-semibold">Premium Content</h2>
                <p className="text-muted-foreground">
                  Login to access exclusive premium properties and advanced features.
                </p>
                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/user-login">Login to Access Premium</Link>
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

  if (user.role === 'Premium') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 via-background to-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-8">
              <Crown className="h-12 w-12 text-primary" />
              <h1 className="text-4xl font-bold">Premium Active</h1>
            </div>
            
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8 text-center space-y-4">
                <div className="h-16 w-16 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center mx-auto">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold">You're a Premium Member!</h2>
                <p className="text-muted-foreground">
                  Enjoy exclusive access to premium properties and advanced features.
                </p>
                <Button asChild className="w-full">
                  <Link href="/premium-dashboard">Go to Premium Dashboard</Link>
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
            <Crown className="h-12 w-12 text-primary" />
            <h1 className="text-4xl font-bold">Unlock Premium Properties</h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get exclusive access to high-value properties, advanced search tools, and priority support.
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
                <CardTitle className="text-2xl capitalize">{planType} Plan</CardTitle>
                <div className="space-y-2">
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold">₹{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  {planType === 'yearly' && (
                    <Badge variant="secondary">Save ₹591 compared to monthly</Badge>
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
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handlePurchase(planType as 'monthly' | 'yearly')}
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
                      Purchase {planType.charAt(0).toUpperCase() + planType.slice(1)}
                    </div>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-16">
          <Card className="text-center">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Eye className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Exclusive Properties</h3>
              <p className="text-sm text-muted-foreground">
                Access high-value properties not available to regular users
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Zap className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Advanced Tools</h3>
              <p className="text-sm text-muted-foreground">
                Property comparison, investment analysis, and market insights
              </p>
            </CardContent>
          </Card>
          
          <Card className="text-center">
            <CardContent className="p-6 space-y-4">
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Priority Support</h3>
              <p className="text-sm text-muted-foreground">
                Get dedicated support and personalized consultation
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
            <Lock className="h-5 w-5" />
            <span>Your payment information is encrypted and secure</span>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
