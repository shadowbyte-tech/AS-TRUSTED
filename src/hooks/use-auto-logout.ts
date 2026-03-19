'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/hooks/use-toast';

// Define protected routes
const PROTECTED_ROUTES = [
  '/dashboard',
  '/admin',
  '/premium-dashboard',
  '/upload',
];

const PUBLIC_ROUTES = [
  '/',
  '/properties',
  '/plots',
  '/normal-plots',
  '/houses',
  '/land',
  '/services',
  '/about',
  '/login',
  '/user-login',
  '/register',
];

export function useAutoLogout() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const previousPathRef = useRef<string>('');
  const isLoggedInRef = useRef<boolean>(false);

  useEffect(() => {
    if (!user) {
      isLoggedInRef.current = false;
      return;
    }

    const isProtectedRoute = PROTECTED_ROUTES.some(route => 
      pathname.startsWith(route)
    );
    
    const isPublicRoute = PUBLIC_ROUTES.some(route => 
      pathname === route || pathname.startsWith(route)
    );

    const wasLoggedIn = isLoggedInRef.current;
    const previousPath = previousPathRef.current;

    // Mark user as logged in
    if (!wasLoggedIn) {
      isLoggedInRef.current = true;
      previousPathRef.current = pathname;
      return;
    }

    // Check if user is navigating from protected to public area
    const wasInProtectedArea = previousPath && PROTECTED_ROUTES.some(route => 
      previousPath.startsWith(route)
    );

    // Auto-logout only if user was in protected area and now navigating to public area
    if (wasInProtectedArea && !isProtectedRoute && isPublicRoute) {
      logout();
      toast({
        title: "Automatically Logged Out",
        description: "You've been logged out for security when leaving the admin area.",
        duration: 3000,
      });
    }

    // Update previous path
    previousPathRef.current = pathname;
  }, [pathname, user, logout]);
}
