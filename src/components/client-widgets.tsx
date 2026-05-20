'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

// Dynamically import heavy client-side components with ssr: false
const QuickActionDock = dynamic(() => import('@/components/quick-action-dock'), { ssr: false });
const AIAgentWrapper = dynamic(() => import('@/components/ai-agent-wrapper'), { ssr: false });

export default function ClientWidgets() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial mount
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <QuickActionDock />
      <AIAgentWrapper />
    </>
  );
}
