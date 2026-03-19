'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Crown, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  Check, 
  X,
  Star,
  Zap,
  Shield,
  BarChart3,
  HeadphonesIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface UpgradeCTAProps {
  variant?: 'sidebar' | 'inline' | 'banner' | 'modal' | 'floating';
  size?: 'sm' | 'md' | 'lg';
  context?: string;
  className?: string;
  showDiscount?: boolean;
}

export default function UpgradeCTA({ 
  variant = 'inline', 
  size = 'md', 
  context,
  className,
  showDiscount = true
}: UpgradeCTAProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const premiumFeatures = [
    { icon: <BarChart3 className="h-5 w-5" />, title: "Advanced Analytics", description: "Deep property insights and market trends" },
    { icon: <Sparkles className="h-5 w-5" />, title: "AI-Powered Tools", description: "Smart recommendations and predictions" },
    { icon: <Zap className="h-5 w-5" />, title: "Priority Access", description: "Be first to know about new properties" },
    { icon: <Shield className="h-5 w-5" />, title: "Premium Support", description: "24/7 dedicated customer service" },
    { icon: <TrendingUp className="h-5 w-5" />, title: "ROI Calculator", description: "Advanced investment analysis tools" },
    { icon: <HeadphonesIcon className="h-5 w-5" />, title: "Expert Consultation", description: "Personalized investment advice" }
  ];

  const sizeStyles = {
    sm: 'p-3 text-sm',
    md: 'p-4 text-base',
    lg: 'p-6 text-lg'
  };

  if (variant === 'sidebar') {
    return (
      <Card className={cn('border-gradient-to-r from-amber-200 to-orange-200 bg-gradient-to-br from-amber-50 to-orange-50', className)}>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Crown className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">Upgrade to Premium</CardTitle>
              <CardDescription className="text-sm">Unlock all features</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {showDiscount && (
            <Badge className="w-full justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              Limited Time: 20% OFF
            </Badge>
          )}
          
          <div className="space-y-2">
            {premiumFeatures.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                <span>{feature.title}</span>
              </div>
            ))}
          </div>

          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            onClick={() => setIsDialogOpen(true)}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade Now
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Cancel anytime • No setup fees
          </p>
        </CardContent>

        <UpgradeDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          context={context}
        />
      </Card>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={cn('relative group', className)}>
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
        
        <Card className="relative border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50 hover:shadow-lg transition-all duration-300">
          <CardContent className={cn('flex items-center justify-between', sizeStyles[size])}>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Crown className={size === 'sm' ? 'h-4 w-4' : 'h-5 w-5'} />
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Unlock Premium Features</h3>
                <p className="text-sm text-muted-foreground">
                  {context ? `Get advanced ${context}` : 'Advanced analytics & tools'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {showDiscount && (
                <Badge className="bg-red-500 text-white text-xs animate-pulse">
                  20% OFF
                </Badge>
              )}
              <Button 
                size={size === 'sm' ? 'sm' : 'default'}
                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
                onClick={() => setIsDialogOpen(true)}
              >
                <Crown className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            </div>
          </CardContent>
        </Card>

        <UpgradeDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          context={context}
        />
      </div>
    );
  }

  if (variant === 'banner') {
    return (
      <Card className={cn('border-gradient-to-r from-amber-500 to-orange-500 bg-gradient-to-r from-amber-50 to-orange-50', className)}>
        <CardContent className={cn('flex items-center justify-between', sizeStyles[size])}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse">
                <Sparkles className="h-6 w-6" />
              </div>
              {showDiscount && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  -20%
                </Badge>
              )}
            </div>
            
            <div>
              <h3 className="font-bold text-amber-900 text-lg">Go Premium Today!</h3>
              <p className="text-amber-700">
                {context ? `Unlock premium ${context} and more` : 'Unlock all premium features and save 20%'}
              </p>
            </div>
          </div>
          
          <Button 
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
            onClick={() => setIsDialogOpen(true)}
          >
            <Crown className="h-5 w-5 mr-2" />
            Upgrade Now
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </CardContent>

        <UpgradeDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          context={context}
        />
      </Card>
    );
  }

  if (variant === 'floating') {
    return (
      <>
        <div className={cn(
          'fixed bottom-4 right-4 z-50 shadow-2xl transition-all duration-300 hover:scale-105',
          className
        )}>
          <Button 
            size="lg"
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold px-6 py-3 rounded-full"
            onClick={() => setIsDialogOpen(true)}
          >
            <Crown className="h-5 w-5 mr-2" />
            Upgrade to Premium
            {showDiscount && (
              <Badge className="ml-2 bg-red-500 text-white text-xs">
                20% OFF
              </Badge>
            )}
          </Button>
        </div>

        <UpgradeDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          context={context}
        />
      </>
    );
  }

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          className={cn('bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white', className)}
        >
          <Crown className="h-4 w-4 mr-2" />
          Upgrade to Premium
        </Button>
      </DialogTrigger>
      <UpgradeDialog 
        isOpen={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)}
        context={context}
      />
    </Dialog>
  );
}

function UpgradeDialog({ 
  isOpen, 
  onClose, 
  context 
}: {
  isOpen: boolean;
  onClose: () => void;
  context?: string;
}) {
  const premiumFeatures = [
    { icon: <BarChart3 className="h-5 w-5" />, title: "Advanced Analytics", description: "Deep property insights and market trends", included: true },
    { icon: <Sparkles className="h-5 w-5" />, title: "AI-Powered Tools", description: "Smart recommendations and predictions", included: true },
    { icon: <Zap className="h-5 w-5" />, title: "Priority Access", description: "Be first to know about new properties", included: true },
    { icon: <Shield className="h-5 w-5" />, title: "Premium Support", description: "24/7 dedicated customer service", included: true },
    { icon: <TrendingUp className="h-5 w-5" />, title: "ROI Calculator", description: "Advanced investment analysis tools", included: true },
    { icon: <HeadphonesIcon className="h-5 w-5" />, title: "Expert Consultation", description: "Personalized investment advice", included: true }
  ];

  const freeFeatures = [
    { icon: <BarChart3 className="h-5 w-5" />, title: "Basic Analytics", description: "Simple property insights", included: true },
    { icon: <Sparkles className="h-5 w-5" />, title: "AI-Powered Tools", description: "Smart recommendations", included: false },
    { icon: <Zap className="h-5 w-5" />, title: "Priority Access", description: "Be first to know", included: false },
    { icon: <Shield className="h-5 w-5" />, title: "Support", description: "Email support only", included: true },
    { icon: <TrendingUp className="h-5 w-5" />, title: "ROI Calculator", description: "Basic calculations", included: false },
    { icon: <HeadphonesIcon className="h-5 w-5" />, title: "Expert Consultation", description: "Personalized advice", included: false }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Crown className="h-6 w-6" />
            </div>
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription>
            {context ? `Unlock premium ${context} and all advanced features` : 'Unlock all premium features and take your property investment to the next level'}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <Card className="border-gray-200">
              <CardHeader className="text-center">
                <CardTitle className="text-lg">Free</CardTitle>
                <CardDescription>Basic features</CardDescription>
                <div className="text-3xl font-bold">₹0<span className="text-lg font-normal text-muted-foreground">/month</span></div>
              </CardHeader>
              <CardContent className="space-y-3">
                {freeFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    {feature.included ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <X className="h-4 w-4 text-gray-400" />
                    )}
                    <span className={cn('text-sm', !feature.included && 'text-muted-foreground')}>
                      {feature.title}
                    </span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-gradient-to-r from-amber-500 to-orange-500 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1">
                  MOST POPULAR
                </Badge>
              </div>
              <CardHeader className="text-center">
                <CardTitle className="text-lg flex items-center justify-center gap-2">
                  Premium
                  <Crown className="h-5 w-5 text-amber-500" />
                </CardTitle>
                <CardDescription>All features unlocked</CardDescription>
                <div className="space-y-1">
                  <div className="text-3xl font-bold">₹999<span className="text-lg font-normal text-muted-foreground">/month</span></div>
                  {context && (
                    <Badge className="bg-red-500 text-white text-xs">
                      Limited Time: 20% OFF
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {premiumFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium">{feature.title}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Testimonial */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
            <div className="flex items-center gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star key={star} className="h-4 w-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-sm italic text-amber-900 mb-2">
              "Premium features helped me find the perfect investment property. The ROI calculator alone saved me thousands!"
            </p>
            <p className="text-xs text-amber-700 font-medium">- Sri Swamy, Premium Member</p>
          </div>

          {/* Urgency */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-900 font-medium mb-1">
              <Sparkles className="h-4 w-4" />
              Limited Time Offer
            </div>
            <p className="text-sm text-red-700">
              Upgrade now and get 20% off your first month. This offer expires tonight!
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button variant="outline" onClick={onClose} className="w-full">
            Maybe Later
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold"
            onClick={() => {
              window.location.href = '/premium';
            }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium - Save 20%
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
