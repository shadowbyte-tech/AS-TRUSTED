'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Database, AlertCircle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DBStatusIndicator() {
  const [status, setStatus] = useState<{ connected: boolean; type: string; error?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/db-status');
        if (res.ok) {
          const data = await res.json();
          setStatus({
            connected: data.connected,
            type: data.database || 'MongoDB Atlas',
            error: data.error
          });
        } else {
          setStatus({ connected: false, type: 'Error', error: 'Failed to fetch status' });
        }
      } catch (err) {
        console.error('Error fetching DB status:', err);
        setStatus({ connected: false, type: 'Error', error: 'Network error' });
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center gap-2 opacity-50">
        <div className="h-2 w-2 rounded-full bg-slate-400 animate-pulse" />
        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Checking DB...</span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2"
    >
      <Database className={`h-4 w-4 ${status?.connected ? 'text-emerald-400' : 'text-amber-400'}`} />
      <span className="text-xs font-bold text-slate-300 uppercase tracking-tight">
        System State: {status?.connected ? 'Online' : 'Offline'} ({status?.type})
      </span>
      {status?.connected && (
        <CheckCircle className="h-3 w-3 text-emerald-400" />
      )}
      {!status?.connected && (
        <AlertCircle className="h-3 w-3 text-amber-400" />
      )}
    </motion.div>
  );
};
