'use client';

import dynamic from 'next/dynamic';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

// Dynamically import heavy client-side components with ssr: false
const QuickActionDock = dynamic(() => import('@/components/quick-action-dock'), { ssr: false });
const AIAgentWrapper = dynamic(() => import('@/components/ai-agent-wrapper'), { ssr: false });
const AICoPilot = dynamic(() => import('@/components/ai-copilot'), { ssr: false });

export default function ClientWidgets() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Initial mount
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isUploadFlow = pathname.startsWith('/upload-property');

  return (
    <>
      <QuickActionDock />
      {!isUploadFlow && <AIAgentWrapper />}
      {!isUploadFlow && <AICoPilot />}
    </>
  );
}
