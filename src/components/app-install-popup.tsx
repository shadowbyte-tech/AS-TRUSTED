'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AppInstallPopup() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPopup, setShowPopup] = useState(false);
  const pathname = usePathname();

  // Hide on dashboard
  const isDashboard = pathname?.includes('/dashboard') || pathname?.includes('/owner-portal') || pathname?.includes('/login');

  useEffect(() => {
    // Listen for the install prompt from the browser
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  useEffect(() => {
    if (isDashboard) return;

    // Show popup initially after 10 seconds
    const initialTimer = setTimeout(() => {
      setShowPopup(true);
    }, 10000);

    return () => clearTimeout(initialTimer);
  }, [isDashboard]);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPopup(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback if not supported or already installed (iOS Safari)
      alert("To install, tap the 'Share' icon at the bottom, then scroll down and tap 'Add to Home Screen'.");
    }
  };

  const handleClose = () => {
    setShowPopup(false);
    // Re-show after 10 seconds as requested: "comes for every 10 secs"
    setTimeout(() => {
      // Only show if not already installed
      if (typeof window !== 'undefined' && !window.matchMedia('(display-mode: standalone)').matches) {
        setShowPopup(true);
      }
    }, 10000);
  };

  if (isDashboard || !showPopup) return null;

  // Check if already installed
  if (typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          drag
          dragConstraints={{ left: -20, right: 20, top: -20, bottom: 20 }}
          dragElastic={0.2}
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            y: [0, -10, 0], // Continuous moving (bouncing)
          }}
          transition={{ 
            y: {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            },
            opacity: { duration: 0.3 },
            scale: { duration: 0.3 }
          }}
          exit={{ opacity: 0, scale: 0.8, y: 50 }}
          className="fixed bottom-6 right-6 z-[200] w-72 cursor-grab active:cursor-grabbing p-4 rounded-2xl bg-navy/95 backdrop-blur-xl border border-gold/30 shadow-2xl shadow-black/50"
        >
          <button 
            onClick={handleClose}
            className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 transition-colors shadow-lg z-10"
          >
            <X size={16} />
          </button>

          <div className="flex items-start gap-3">
            <div className="bg-gradient-to-br from-gold to-amber-600 rounded-xl p-2.5 shadow-inner">
              <Download className="text-navy w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-gold text-sm font-headline">Install AS Trusted App</h4>
              <p className="text-white/80 text-xs mt-1 leading-tight">
                Get VIP access & faster browsing. Tap to install the app on your phone!
              </p>
            </div>
          </div>

          <button 
            onClick={handleInstallClick}
            className="w-full mt-3 py-2 bg-white/10 hover:bg-gold hover:text-navy text-white transition-all rounded-xl text-sm font-bold flex items-center justify-center gap-2"
          >
            <Download size={16} />
            Install App Now
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
