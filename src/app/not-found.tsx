'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Search, MessageCircle } from 'lucide-react';

export default function NotFound() {
  const ownerPhone = "9866404090";
  
  const handleWhatsAppReport = () => {
    const message = `🚨 *PAGE NOT FOUND REPORT* 🚨\n\nDear Owner, a client encountered a 404 error on the AS Trusted Consultancy portal.\n\n*Missing Path:* ${window.location.pathname}\n\n*Action Required:* Please verify if this link should be active or redirected.`;
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
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-2xl w-full bg-slate-900/50 backdrop-blur-2xl p-12 rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.5)] text-center relative z-10"
      >
        <div className="mb-8 relative flex justify-center">
          <div className="h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500/10 to-transparent flex items-center justify-center border border-white/5">
            <Search className="h-16 w-16 text-cyan-500/40" />
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-7xl font-black text-white opacity-10 select-none">404</div>
          </div>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight tracking-tight">
          Coordinate Mismatch
        </h1>
        
        <p className="text-slate-400 text-lg mb-10 leading-relaxed font-medium">
          The property or page you are seeking is currently navigating through our secure servers. While this specific coordinate is unreachable, our vast collection remains <span className="text-cyan-400 font-bold">online 24/7</span>.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button asChild className="w-full sm:w-auto bg-gradient-to-r from-cyan-600 to-blue-700 hover:from-cyan-500 hover:to-blue-600 text-white h-16 px-10 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-3">
            <Link href="/premium-dashboard">
              <Home className="h-5 w-5" />
              Return to Catalog
            </Link>
          </Button>

          <Button 
            variant="outline"
            onClick={handleWhatsAppReport}
            className="w-full sm:w-auto border-white/10 text-slate-300 hover:bg-white/5 h-16 px-10 rounded-2xl font-black transition-all flex items-center justify-center gap-3"
          >
            <MessageCircle className="h-5 w-5" />
            Report Mismatch
          </Button>
        </div>
      </motion.div>
    </div>
  );
}