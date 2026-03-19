'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Sparkles, Send } from 'lucide-react';

export default function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('Hi! I\'m interested in learning more about your premium properties.');

  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/919866404090?text=${encodedMessage}`, '_blank');
  };

  return (
    <>
      <div className="fixed bottom-24 left-6 z-[100] md:bottom-10 md:left-10">
        {/* Draggable & Glowing Round Button */}
        <motion.div
          drag
          dragConstraints={{ left: -300, right: 0, top: -500, bottom: 0 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative group cursor-grab active:cursor-grabbing"
        >
          {/* Animated Glow Halo */}
          <div className="absolute inset-0 bg-emerald-500 rounded-full blur-[20px] opacity-40 group-hover:opacity-70 animate-pulse transition-opacity" />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="relative h-16 w-16 md:h-20 md:w-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-600 p-0 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.4)] border-2 border-white/20 overflow-hidden"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X className="h-8 w-8 text-white" />
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <MessageCircle className="h-8 w-8 text-white" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Glossy Overlay */}
            <div className="absolute top-0 left-0 w-full h-[50%] bg-white/20 -skew-y-12" />
          </button>

          {/* Sparkle Decoration */}
          <div className="absolute -top-2 -right-2">
            <Sparkles className="h-5 w-5 text-amber-300 animate-bounce" />
          </div>
        </motion.div>

        {/* WhatsApp Dialog */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
              className="absolute bottom-20 right-0 md:bottom-24 w-[calc(100vw-3rem)] max-w-[320px] bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden z-[101]"
            >
              <div className="bg-gradient-to-r from-emerald-500/20 to-blue-500/10 p-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                    <MessageCircle className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-sm uppercase tracking-widest">AS Trusted AI</h3>
                    <p className="text-emerald-400/70 text-[10px] uppercase font-bold tracking-widest">Always Online</p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest px-1">Message Draft</p>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white/5 border border-white/5 rounded-2xl p-4 text-sm text-slate-200 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none h-24"
                    placeholder="Describe your inquiry..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setMessage("I'm interested in Commercial Plots.")}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-slate-400 transition-colors lowercase tracking-tighter"
                  >
                    #commercial
                  </button>
                  <button
                    onClick={() => setMessage("I'm interested in Open Plots.")}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-slate-400 transition-colors lowercase tracking-tighter"
                  >
                    #openplots
                  </button>
                </div>

                <button
                  onClick={handleWhatsAppClick}
                  className="w-full h-14 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-500 hover:to-green-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Send className="h-4 w-4" />
                  Launch WhatsApp
                </button>
              </div>

              <div className="p-4 bg-black/40 text-center">
                <p className="text-[9px] font-medium text-slate-500 uppercase tracking-widest">Secure end-to-end consultancy</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
