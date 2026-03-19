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
import { Lock, Crown, Sparkles, TrendingUp, Shield, Zap, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LockedFeatureProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  featureType: 'analytics' | 'ai-tools' | 'priority-support' | 'advanced-filters' | 'export-data';
  className?: string;
  compact?: boolean;
}

const featureDetails = {
  'analytics': {
    benefits: [
      'Advanced property analytics',
      'Market trend analysis',
      'ROI calculations',
      'Investment insights'
    ],
    icon: <TrendingUp className="h-5 w-5" />,
    color: 'from-blue-500 to-purple-500'
  },
  'ai-tools': {
    benefits: [
      'AI-powered recommendations',
      'Smart property matching',
      'Price predictions',
      'Automated valuations'
    ],
    icon: <Sparkles className="h-5 w-5" />,
    color: 'from-purple-500 to-pink-500'
  },
  'priority-support': {
    benefits: [
      '24/7 priority support',
      'Dedicated account manager',
      'Fast response times',
      'Expert consultation'
    ],
    icon: <Shield className="h-5 w-5" />,
    color: 'from-green-500 to-teal-500'
  },
  'advanced-filters': {
    benefits: [
      'Advanced search filters',
      'Custom saved searches',
      'Alert notifications',
      'Market comparisons'
    ],
    icon: <Zap className="h-5 w-5" />,
    color: 'from-orange-500 to-red-500'
  },
  'export-data': {
    benefits: [
      'Export to Excel/PDF',
      'Custom reports',
      'Data analysis tools',
      'API access'
    ],
    icon: <ArrowRight className="h-5 w-5" />,
    color: 'from-indigo-500 to-blue-500'
  }
};

export default function LockedFeature({ 
  title, 
  description, 
  icon, 
  featureType, 
  className,
  compact = false 
}: LockedFeatureProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const details = featureDetails[featureType];

  if (compact) {
    return (
      <div className={cn('relative group', className)}>
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-lg blur-sm group-hover:blur-md transition-all" />
        <Card className="relative border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                <Lock className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{title}</h4>
                <p className="text-xs text-muted-foreground">{description}</p>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsDialogOpen(true)}
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
              >
                Unlock
              </Button>
            </div>
          </CardContent>
        </Card>

        <UnlockDialog 
          isOpen={isDialogOpen} 
          onClose={() => setIsDialogOpen(false)}
          title={title}
          description={description}
          featureType={featureType}
        />
      </div>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      {/* Hover glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-amber-500/20 to-orange-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-all duration-300" />
      
      <Card className="relative border-amber-200 bg-gradient-to-br from-amber-50/50 to-orange-50/50 hover:shadow-xl transition-all duration-300 group-hover:border-amber-300">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                {icon || <Lock className="h-6 w-6" />}
              </div>
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs px-1.5 py-0.5">
                  PRO
                </Badge>
              </div>
            </div>
            <div className="flex-1">
              <CardTitle className="text-lg">{title}</CardTitle>
              <CardDescription className="text-sm">{description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-amber-700 font-medium">
              <Crown className="h-4 w-4" />
              Premium Feature
            </div>
            
            <div className="space-y-2">
              {details.benefits.slice(0, 3).map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-3 w-3 text-green-500" />
                  {benefit}
                </div>
              ))}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium"
                  onClick={() => setIsDialogOpen(true)}
                >
                  <Crown className="h-4 w-4 mr-2" />
                  Unlock Premium Feature
                </Button>
              </DialogTrigger>
              <UnlockDialog 
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)}
                title={title}
                description={description}
                featureType={featureType}
              />
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function UnlockDialog({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  featureType 
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  featureType: string;
}) {
  const details = featureDetails[featureType as keyof typeof featureDetails];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white">
              <Crown className="h-5 w-5" />
            </div>
            Unlock {title}
          </DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-lg p-4">
            <h4 className="font-semibold text-amber-900 mb-3">What you'll get:</h4>
            <div className="space-y-2">
              {details.benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-900 font-medium mb-2">
              <Sparkles className="h-4 w-4" />
              Limited Time Offer
            </div>
            <p className="text-sm text-blue-700">
              Upgrade now and get 20% off your first month!
            </p>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-col gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="w-full"
          >
            Maybe Later
          </Button>
          <Button 
            className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
            onClick={() => {
              window.location.href = '/premium';
            }}
          >
            <Crown className="h-4 w-4 mr-2" />
            Upgrade to Premium
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
