'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, 
  Crown, 
  UserCog, 
  ChevronUp, 
  X, 
  Zap,
  ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function MobileQuickAccess() {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Don't show if user is logged in or on auth pages
  const isAuthPage = pathname.startsWith('/login') || 
                     pathname.startsWith('/register') || 
                     pathname.startsWith('/user-login');
  
  if (user || isAuthPage) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[60] lg:hidden">
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[-1]"
            />

            {/* Actions Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20, x: 20 }}
              className="mb-4 flex flex-col items-end gap-3"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-1 mr-2 drop-shadow-lg">
                Elite Access Portal
              </p>
              
              {/* Executive Portal */}
              <Link href="/login" onClick={() => setIsOpen(false)}>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-slate-900/90 border border-blue-500/30 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md"
                >
                  <span className="text-white text-xs font-bold">Executive Portal</span>
                  <div className="h-10 w-10 rounded-xl bg-blue-500/20 flex items-center justify-center border border-blue-500/40">
                    <UserCog className="h-5 w-5 text-blue-400" />
                  </div>
                </motion.div>
              </Link>

              {/* Premium Access */}
              <Link href="/user-login" onClick={() => setIsOpen(false)}>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-slate-900/90 border border-amber-500/30 px-4 py-3 rounded-2xl shadow-2xl backdrop-blur-md"
                >
                  <span className="text-white text-xs font-bold">Premium Access</span>
                  <div className="h-10 w-10 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-500/40">
                    <Crown className="h-5 w-5 text-amber-400" />
                  </div>
                </motion.div>
              </Link>

              {/* Get Started */}
              <Link href="/register" onClick={() => setIsOpen(false)}>
                <motion.div 
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-3 bg-amber-600 border border-amber-400/30 px-4 py-3 rounded-2xl shadow-2xl"
                >
                  <span className="text-white text-xs font-extrabold uppercase tracking-wider">Get Started</span>
                  <div className="h-10 w-10 rounded-xl bg-white/20 flex items-center justify-center border border-white/30">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Trigger Button */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 w-16 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.4)] border transition-all duration-500",
          isOpen 
            ? "bg-slate-900 border-white/20 text-white" 
            : "bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 border-white/30 text-white"
        )}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X className="h-8 w-8" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <Zap className="h-6 w-6 mb-0.5 fill-current" />
              <span className="text-[8px] font-black uppercase tracking-tighter">Portal</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shimmer Effect */}
        {!isOpen && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-[shimmer_2s_infinite]" />
          </div>
        )}
      </motion.button>
    </div>
  );
}
