'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, MessageCircle, RefreshCcw, Home, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('System Exception:', error);
  }, [error]);

  const ownerPhone = "9866404090";
  const errorDetails = `Error: ${error.message}\nDigest: ${error.digest || 'N/A'}\nPath: ${window.location.pathname}\nTime: ${new Date().toISOString()}`;
  
  const handleWhatsAppReport = () => {
    const message = `🚨 *SYSTEM ERROR REPORT* 🚨\n\nDear Owner, a rare technical glitch has occurred on the AS Trusted Consultancy portal.\n\n*Technical Details:*\n${errorDetails}\n\n*Action Required:* Please review the server logs to restore maximum peak performance immediately.`;
    const whatsappUrl = `https://wa.me/${ownerPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#03070f] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium Background Graphics */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] text-center relative z-10"
      >
        <div className="mb-8 relative flex justify-center">
          <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-cyan-500/20 to-purple-500/20 flex items-center justify-center border border-cyan-500/30">
            <Brain className="h-12 w-12 text-cyan-400 animate-pulse" />
          </div>
          <div className="absolute -top-4 -right-2 p-2 bg-emerald-500/10 rounded-full border border-emerald-500/30">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
          Optimization in Progress
        </h1>
        
        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
          A truly premium website like <span className="text-cyan-400 font-bold">AS Trusted</span> never closes. Our AI-driven maintenance engine is currently resolving a minor technical anomaly to ensure your experience remains elite and uninterrupted.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            onClick={() => reset()}
            className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white h-16 px-10 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
          >
            <RefreshCcw className="h-5 w-5" />
            Restore Page
          </Button>

          <Button 
            variant="outline"
            onClick={handleWhatsAppReport}
            className="w-full sm:w-auto border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10 h-16 px-10 rounded-2xl font-black transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle className="h-5 w-5" />
            Report to Owner
          </Button>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5">
          <Button 
            variant="ghost" 
            onClick={() => window.location.href = '/'}
            className="text-slate-500 hover:text-white transition-colors gap-2"
          >
            <Home className="h-4 w-4" />
            Return Home
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
