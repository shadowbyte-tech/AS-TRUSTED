'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const AIAgent = dynamic(() => import('./ai-agent'), { ssr: false });

export default function AIAgentWrapper() {
  const [mounted, setMounted] = useState(false);

  // Defer AI widget mount to avoid blocking critical LCP
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Render the premium Buddy AI engine with built-in daily limit and local fallback checks
  return <AIAgent />;
}
