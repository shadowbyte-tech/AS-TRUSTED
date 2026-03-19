'use client';

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function PropertiesPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  
  
  

  // Handle redirection in useEffect, not during render
  useEffect(() => {
    if (isLoading) {
      
      return;
    }

    
    
    
    
    // Redirect based on user access level
    if (!user) {
      
      // Unauthenticated users - show normal properties
      router.replace('/normal-properties');
      return;
    }

    if (user.role === 'User') {
      
      // Regular users - show normal properties
      router.replace('/normal-properties');
      return;
    }

    if (user.role === 'Premium' || user.role === 'Owner') {
      
      // Premium users and owners - show premium properties
      router.replace('/premium-properties');
      return;
    }

    
    // Fallback to normal properties
    router.replace('/normal-properties');
  }, [user, isLoading, router]);

  // Show loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Redirecting to properties...</p>
      </div>
    </div>
  );
}
