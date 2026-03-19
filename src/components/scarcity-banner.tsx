'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Clock, 
  Crown, 
  Sparkles, 
  TrendingUp, 
  Users, 
  AlertCircle,
  ArrowRight,
  Timer
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScarcityBannerProps {
  variant?: 'countdown' | 'limited-spots' | 'flash-sale' | 'urgent';
  position?: 'top' | 'sidebar' | 'floating';
  className?: string;
}

export default function ScarcityBanner({ 
  variant = 'countdown', 
  position = 'top',
  className 
}: ScarcityBannerProps) {
  const [timeLeft, setTimeLeft] = useState({
    hours: 23,
    minutes: 59,
    seconds: 59
  });
  const [spotsLeft, setSpotsLeft] = useState(17);
  const [concurrentUsers, setConcurrentUsers] = useState(47);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        const totalSeconds = prev.hours * 3600 + prev.minutes * 60 + prev.seconds - 1;
        
        if (totalSeconds <= 0) {
          return { hours: 0, minutes: 0, seconds: 0 };
        }
        
        return {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // Simulate spots being taken
    const spotsTimer = setInterval(() => {
      setSpotsLeft(prev => {
        if (prev <= 1) return prev;
        return Math.random() > 0.7 ? prev - 1 : prev;
      });
    }, 15000);

    return () => clearInterval(spotsTimer);
  }, []);

  useEffect(() => {
    // Simulate concurrent users
    const usersTimer = setInterval(() => {
      setConcurrentUsers(prev => {
        const change = Math.floor(Math.random() * 11) - 5;
        return Math.max(20, Math.min(100, prev + change));
      });
    }, 5000);

    return () => clearInterval(usersTimer);
  }, []);

  const formatTime = (value: number) => value.toString().padStart(2, '0');

  if (variant === 'countdown') {
    return (
      <Card className={cn(
        'border-gradient-to-r from-amber-500 to-orange-500 bg-gradient-to-r from-amber-50 to-orange-50',
        position === 'floating' && 'fixed top-4 right-4 z-50 max-w-sm shadow-2xl',
        className
      )}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse">
                <Clock className="h-5 w-5" />
              </div>
              <div className="absolute -top-1 -right-1">
                <Badge className="bg-red-500 text-white text-xs animate-pulse">
                  NEW
                </Badge>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-bold text-amber-900">Limited Time Offer</h3>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs">
                  20% OFF
                </Badge>
              </div>
              
              <div className="flex items-center gap-2 text-sm text-amber-700">
                <Timer className="h-4 w-4" />
                <span className="font-mono font-bold">
                  {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
                </span>
                <span className="text-xs">remaining</span>
              </div>
            </div>

            <Button 
              size="sm"
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => window.location.href = '/premium'}
            >
              <Crown className="h-4 w-4 mr-1" />
              Claim
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'limited-spots') {
    return (
      <Card className={cn(
        'border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50',
        position === 'floating' && 'fixed bottom-4 right-4 z-50 max-w-sm shadow-2xl',
        className
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <h3 className="font-bold text-amber-900">Only {spotsLeft} Premium Spots Left!</h3>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Availability</span>
                <span className="font-bold text-amber-700">{spotsLeft}/20 spots</span>
              </div>
              <div className="w-full bg-amber-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(spotsLeft / 20) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              <span>{concurrentUsers} people viewing this offer</span>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white"
              onClick={() => window.location.href = '/premium'}
            >
              <Crown className="h-4 w-4 mr-2" />
              Secure Your Spot
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'flash-sale') {
    return (
      <Card className={cn(
        'border-red-200 bg-gradient-to-r from-red-50 to-pink-50',
        position === 'floating' && 'fixed top-20 left-4 z-50 max-w-sm shadow-2xl',
        className
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-red-500 text-white animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-red-900">FLASH SALE!</h3>
              <Badge className="bg-red-500 text-white text-xs animate-pulse">
                40% OFF
              </Badge>
            </div>
            
            <p className="text-sm text-red-700">
              Premium membership at the lowest price ever!
            </p>

            <div className="flex items-center gap-2 text-sm font-mono text-red-600">
              <Clock className="h-4 w-4" />
              {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:{formatTime(timeLeft.seconds)}
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold"
              onClick={() => window.location.href = '/premium'}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Get 40% OFF Now
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'urgent') {
    return (
      <Card className={cn(
        'border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50',
        position === 'floating' && 'fixed bottom-20 left-4 z-50 max-w-sm shadow-2xl',
        className
      )}>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded bg-orange-500 text-white animate-bounce">
                <AlertCircle className="h-4 w-4" />
              </div>
              <h3 className="font-bold text-orange-900">Last Chance!</h3>
            </div>
            
            <p className="text-sm text-orange-700">
              Premium offer expires tonight. Don't miss out!
            </p>

            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-orange-600">{formatTime(timeLeft.hours)}</div>
                <div className="text-xs text-muted-foreground">Hours</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-orange-600">{formatTime(timeLeft.minutes)}</div>
                <div className="text-xs text-muted-foreground">Minutes</div>
              </div>
              <div className="bg-white rounded p-2">
                <div className="text-lg font-bold text-orange-600">{formatTime(timeLeft.seconds)}</div>
                <div className="text-xs text-muted-foreground">Seconds</div>
              </div>
            </div>

            <Button 
              className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white font-bold"
              onClick={() => window.location.href = '/premium'}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Claim Before Gone
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return null;
}
