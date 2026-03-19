'use client';

import { useAuth } from '@/lib/auth-context';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';

const AIAgent = dynamic(() => import('./ai-agent'), { ssr: false });
const BuggyAI = dynamic(() => import('./buggy-ai'), { ssr: false });

export default function AIAgentWrapper() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  // Defer AI widget mount to avoid blocking critical LCP
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  // Show Buddy AI (full capability) for Premium, Elite, and Owner users
  if (user && ['Premium', 'Elite', 'Owner'].includes(user.role)) {
    return <AIAgent />;
  }

  // Buggy AI (conversion funnel) for everyone else — including guests
  return <BuggyAI />;
}
