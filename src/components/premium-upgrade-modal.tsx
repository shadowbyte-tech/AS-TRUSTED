'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Crown, Lock, Star, ArrowRight, X, User } from 'lucide-react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';

interface PremiumUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  featureName: string;
  featureDescription: string;
}

export default function PremiumUpgradeModal({ isOpen, onClose, featureName, featureDescription }: PremiumUpgradeModalProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = () => {
    setIsLoading(true);
    // Close modal immediately
    onClose();
    
    // Redirect to registration page
    window.location.href = '/register';
  };

  const handleLogin = () => {
    setIsLoading(true);
    onClose();
    // Redirect to user login
    window.location.href = '/user-login';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-gradient-to-br from-slate-900 via-purple-900/20 to-slate-900 border-purple-500/30">
        <DialogHeader className="flex flex-col items-start justify-between space-y-2 pb-4">
          <DialogTitle className="text-xl font-bold text-purple-200">
            <div className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-amber-400" />
              Premium Feature
            </div>
          </DialogTitle>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-purple-200/60 hover:text-purple-200 hover:bg-purple-500/10 rounded-full h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <DialogContent className="space-y-6">
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-4">
              <Crown className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-purple-200 mb-2">
              This is a Premium Feature
            </h3>
            <p className="text-purple-200/80 text-sm">
              {featureDescription}
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-amber-500/20 border border-purple-500/30">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-amber-500 flex items-center justify-center">
                <Star className="w-4 h-4 text-white" />
              </div>
              <div>
                <h4 className="font-bold text-purple-200">Unlock Premium Access</h4>
                <p className="text-sm text-purple-200/60">
                  Get unlimited access to all premium features
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/10 border border-white/20">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                <Lock className="w-4 w-4 text-purple-400" />
              </div>
              <div>
                <h4 className="font-bold text-purple-200">One-Time Payment</h4>
                <p className="text-sm text-purple-200/60">
                  ₹2000 for lifetime access
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button 
              onClick={handleLogin}
              variant="outline" 
              size="lg" 
              className="w-full h-12 px-6 rounded-full border-purple-500/30 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300 transition-all font-bold uppercase tracking-wider text-sm"
            >
              <User className="mr-2 h-4 w-4" />
              Login for Free
            </Button>
            <Button 
              onClick={handleUpgrade}
              size="lg" 
              className="w-full h-12 px-6 rounded-full bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-700 hover:to-amber-700 text-white shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all font-bold uppercase tracking-widest text-sm border-0"
            >
              <Crown className="mr-2 h-4 w-4" />
              Upgrade to Premium
            </Button>
          </div>

          <div className="text-center pt-4">
            <p className="text-xs text-purple-300/60">
              <span className="font-medium">💎 15% average ROI achieved by premium members</span>
            </p>
          </div>
        </DialogContent>
      </DialogContent>
    </Dialog>
  );
}
