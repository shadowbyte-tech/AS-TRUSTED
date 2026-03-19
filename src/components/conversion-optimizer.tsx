'use client';

import { useState, useEffect } from 'react';
import PremiumBadge from './premium-badge';
import LockedFeature from './locked-feature';
import ScarcityBanner from './scarcity-banner';
import UpgradeCTA from './upgrade-cta';
import PremiumComparison from './premium-comparison';

interface ConversionOptimizerProps {
  userRole: 'User' | 'Premium' | 'Owner';
  currentPage: string;
  showComparison?: boolean;
}

export default function ConversionOptimizer({ 
  userRole, 
  currentPage, 
  showComparison = false 
}: ConversionOptimizerProps) {
  const [showScarcityBanner, setShowScarcityBanner] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [timeOnPage, setTimeOnPage] = useState(0);
  const [showExitIntent, setShowExitIntent] = useState(false);

  // Track user behavior
  useEffect(() => {
    const scrollTimer = setInterval(() => {
      setScrollProgress(window.scrollY / (document.documentElement.scrollHeight - window.innerHeight));
    }, 100);

    const timeTimer = setInterval(() => {
      setTimeOnPage(prev => prev + 1);
    }, 1000);

    // Exit intent detection
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && userRole === 'User') {
        setShowExitIntent(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      clearInterval(scrollTimer);
      clearInterval(timeTimer);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [userRole]);

  // Don't show conversion elements to Premium users or Owner
  if (userRole === 'Premium' || userRole === 'Owner') {
    return null;
  }

  return (
    <>
      {/* Top Scarcity Banner */}
      {showScarcityBanner && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <ScarcityBanner 
            variant="countdown" 
            position="top"
            className="rounded-none border-x-0 border-t-0"
          />
        </div>
      )}

      {/* Floating Upgrade CTA */}
      {timeOnPage > 30 && (
        <div className="fixed bottom-4 right-4 z-30">
          <UpgradeCTA variant="floating" context={currentPage} />
        </div>
      )}

      {/* Sidebar Upgrade CTA */}
      {scrollProgress > 0.3 && (
        <div className="hidden lg:block fixed left-4 top-1/2 transform -translate-y-1/2 z-20 w-64">
          <UpgradeCTA 
            variant="sidebar" 
            context={currentPage}
            showDiscount={true}
          />
        </div>
      )}

      {/* Exit Intent Modal */}
      {showExitIntent && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="text-center space-y-4">
              <div className="p-3 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white w-16 h-16 mx-auto flex items-center justify-center">
                <span className="text-2xl font-bold">!</span>
              </div>
              <h3 className="text-xl font-bold">Wait! Don't Miss Out</h3>
              <p className="text-muted-foreground">
                Before you go, check out our premium features that could help you find your dream property faster.
              </p>
              <div className="space-y-2">
                <UpgradeCTA variant="modal" context={currentPage} />
                <button 
                  onClick={() => setShowExitIntent(false)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  No thanks, I'll continue browsing
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Premium Comparison Page */}
      {showComparison && (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 py-8">
          <div className="container px-4">
            <PremiumComparison />
          </div>
        </div>
      )}
    </>
  );
}

// Hook to use conversion optimizer in any component
export function useConversionOptimizer() {
  const [userRole, setUserRole] = useState<'User' | 'Premium' | 'Owner'>('User');
  const [currentPage, setCurrentPage] = useState('');

  useEffect(() => {
    // Get user role from auth context or API
    const fetchUserRole = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const user = await response.json();
          setUserRole(user.role);
        }
      } catch (error) {
        console.error('Failed to fetch user role:', error);
      }
    };

    fetchUserRole();
    setCurrentPage(window.location.pathname);
  }, []);

  return {
    userRole,
    currentPage,
    shouldShowConversionElements: userRole === 'User'
  };
}
