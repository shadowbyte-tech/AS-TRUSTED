'use client';

import { Calendar } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { motion } from 'framer-motion';

export function MobileStickyActions() {
    const { user } = useAuth();

    // Do not show to Owner
    if (user?.role === 'Owner') return null;

    return (
        <div className="fixed bottom-[110px] right-6 z-[9990] md:bottom-[110px] md:right-10 flex flex-col items-center gap-2">
            <motion.a
                href="/book-site-visit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="group relative flex items-center justify-center"
            >
                {/* Tooltip Label */}
                <div className="absolute right-full mr-4 px-3 py-1 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-white/20">
                    Book Site Visit
                </div>

                {/* Round Floating Button */}
                <div className="relative h-14 w-14 md:h-16 md:w-16 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 p-0.5 shadow-[0_8px_32px_rgba(59,130,246,0.3)] border border-white/20 flex items-center justify-center overflow-hidden">
                    <Calendar className="h-6 w-6 text-white" />
                    
                    {/* Glossy Overlay */}
                    <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-br from-white/20 to-transparent rotate-45 pointer-events-none" />
                </div>
            </motion.a>
        </div>
    );
}
