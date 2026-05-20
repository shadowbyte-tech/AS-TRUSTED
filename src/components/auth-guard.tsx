'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  // Track whether we've completed at least one auth check
  const hasChecked = useRef(false);

  useEffect(() => {
    // Only redirect AFTER the first auth check has completed (isLoading becomes false)
    if (isLoading) return;

    hasChecked.current = true;

    const isOwnerOrPremium = user?.role?.toLowerCase() === 'owner' || user?.role?.toLowerCase() === 'premium';

    if (!user || !isOwnerOrPremium) {
      toast({
        title: 'Access Denied',
        description: 'You must be an owner or premium user to view this page.',
        variant: 'destructive',
      });
      router.replace('/user-login');
    }
  }, [user, isLoading, router, toast]);

  // Show skeleton while loading OR while we haven't checked yet
  if (isLoading || !hasChecked.current) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4 p-8 w-full max-w-md">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
        </div>
      </div>
    );
  }

  const isOwnerOrPremium = user?.role?.toLowerCase() === 'owner' || user?.role?.toLowerCase() === 'premium';
  if (!user || !isOwnerOrPremium) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="space-y-4 p-8 w-full max-w-md">
          <Skeleton className="h-10 w-3/4" />
          <Skeleton className="h-24 w-full" />
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
