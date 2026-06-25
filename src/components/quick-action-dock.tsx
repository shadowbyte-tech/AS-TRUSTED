'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { Bot, CalendarCheck, MessageCircle, Send, Sparkles, X, Zap } from 'lucide-react';

const ownerWhatsApp = '919866404090';

export default function QuickActionDock() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("Hi! I'm interested in AS Trusted Consultancy properties.");

  const isPublicDockPage = ['/', '/about', '/services'].includes(pathname);

  if (!isPublicDockPage) return null;

  const openWhatsApp = () => {
    window.open(`https://wa.me/${ownerWhatsApp}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9990] md:bottom-8 md:right-auto md:left-8">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="mb-3 w-[calc(100vw-2rem)] max-w-[340px] overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/95 text-white shadow-2xl shadow-black/50 backdrop-blur-xl"
          >
            <div className="border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/20 bg-amber-400/10">
                  <Zap className="h-4 w-4 text-amber-300" />
                </div>
                <div>
                  <p className="text-sm font-bold">Quick Actions</p>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-500">AS Trusted</p>
                </div>
              </div>
            </div>

            <div className="space-y-2 p-3">
              <Link
                href="/book-site-visit"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 rounded-xl border border-blue-400/15 bg-blue-400/10 px-3 py-3 text-sm font-semibold text-blue-100 transition-colors hover:bg-blue-400/15"
              >
                <CalendarCheck className="h-4 w-4 text-blue-300" />
                Book Site Visit
              </Link>

              <button
                type="button"
                onClick={() => {
                  window.dispatchEvent(new Event('as-open-ai-assistant'));
                  setIsOpen(false);
                }}
                className="flex items-center gap-3 rounded-xl border border-amber-400/15 bg-amber-400/10 px-3 py-3 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-400/15"
              >
                <Bot className="h-4 w-4 text-amber-300" />
                AI Assistant
              </button>

              <div className="rounded-xl border border-emerald-400/15 bg-emerald-400/10 p-3">
                <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-100">
                  <MessageCircle className="h-4 w-4 text-emerald-300" />
                  WhatsApp
                </div>
                <textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  className="h-20 w-full resize-none rounded-lg border border-white/10 bg-black/30 p-3 text-xs text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-emerald-300/40"
                  placeholder="Write your inquiry..."
                />
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-xs font-bold uppercase tracking-[0.16em] text-black transition-colors hover:bg-emerald-400"
                >
                  <Send className="h-4 w-4" />
                  Send
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="group relative flex justify-end">
        <div className="pointer-events-none absolute right-full top-1/2 mr-3 hidden -translate-y-1/2 whitespace-nowrap rounded-lg border border-white/10 bg-zinc-950/95 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-300 opacity-0 shadow-xl transition-opacity group-hover:opacity-100 md:block">
          Quick Actions
        </div>
        <motion.button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          className="flex h-14 w-14 items-center justify-center rounded-full border border-amber-300/25 bg-zinc-950/90 text-amber-200 shadow-[0_16px_45px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-colors hover:border-amber-300/45 hover:bg-zinc-900 md:h-16 md:w-16"
          aria-label={isOpen ? 'Close quick actions' : 'Open quick actions'}
          aria-expanded={isOpen}
        >
          <AnimatePresence mode="wait" initial={false}>
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
              >
                <X className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -45 }}
              >
                <Sparkles className="h-6 w-6" />
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
}
