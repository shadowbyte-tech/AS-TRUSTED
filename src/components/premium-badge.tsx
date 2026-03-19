'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Crown, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PremiumBadgeProps {
  variant?: 'default' | 'glowing' | 'pulse' | 'shimmer';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export default function PremiumBadge({ 
  variant = 'glowing', 
  size = 'md', 
  showText = true,
  className 
}: PremiumBadgeProps) {
  const [sparkles, setSparkles] = useState<number[]>([]);

  useEffect(() => {
    // Generate random sparkles for animation
    const interval = setInterval(() => {
      setSparkles(Array.from({ length: 3 }, () => Math.random()));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  };

  const variantStyles = {
    default: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400',
    glowing: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 shadow-lg shadow-amber-500/50 animate-pulse',
    pulse: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white border-amber-400 animate-pulse',
    shimmer: 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 text-white border-amber-400 bg-[length:200%_100%] animate-shimmer'
  };

  return (
    <div className="relative inline-block">
      {/* Animated sparkles */}
      {variant === 'glowing' && sparkles.map((_, i) => (
        <Sparkles
          key={i}
          className={cn(
            'absolute text-amber-300 animate-pulse',
            iconSizes[size],
            `top-${[-1, 0, 1][i]} left-${[-1, 1, 0][i]}`
          )}
          style={{
            animationDelay: `${i * 0.3}s`,
            top: `${Math.random() * 20 - 10}px`,
            left: `${Math.random() * 20 - 10}px`,
          }}
        />
      ))}

      <Badge
        className={cn(
          'relative overflow-hidden font-semibold border transition-all duration-300 hover:scale-105',
          sizeClasses[size],
          variantStyles[variant],
          className
        )}
      >
        <div className="flex items-center gap-1.5">
          <Crown className={cn('fill-current', iconSizes[size])} />
          {showText && (
            <span>Premium</span>
          )}
          {variant === 'pulse' && (
            <Zap className={cn('fill-current animate-pulse', iconSizes[size])} />
          )}
        </div>

        {/* Shimmer effect overlay */}
        {variant === 'shimmer' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
        )}
      </Badge>

      {/* Glow effect */}
      {variant === 'glowing' && (
        <div className="absolute inset-0 bg-amber-400/20 rounded-lg blur-md -z-10 animate-pulse" />
      )}
    </div>
  );
}

// Add shimmer animation to globals
const shimmerAnimation = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
`;

if (typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.textContent = shimmerAnimation;
  document.head.appendChild(style);
}
