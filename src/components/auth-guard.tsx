'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from './ui/skeleton';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && (!user || (user.role !== 'Owner' && user.role !== 'Premium'))) {
      toast({
        title: 'Access Denied',
        description: 'You must be an owner or premium user to view this page.',
        variant: 'destructive',
      });
      router.replace('/user-login');
    }
  }, [user, isLoading, router, toast]);

  if (isLoading || !user || (user.role !== 'Owner' && user.role !== 'Premium')) {
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

  return <>{children}</>;
}
