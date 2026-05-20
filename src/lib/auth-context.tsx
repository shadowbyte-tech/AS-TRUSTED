'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import type { AuthUser } from './auth';

interface AuthContextType {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: AuthUser | null }>;
  logout: () => Promise<void>;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  updateUser: (userData: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch the session from the server (reads our HTTP-only cookies)
  const refreshUser = React.useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const data = await response.json();
        setUser(data.user || null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Use startTransition-like pattern: set loading false only after user state is committed
    refreshUser().finally(() => setIsLoading(false));
  }, []);


  const login = React.useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string; user?: { id: string; email: string; role: string } | null }> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        return { success: false, error: `Server error (${response.status}). Please try again later.` };
      }

      const data = await response.json();

      if (response.ok && data.success) {
        // Set user from login response immediately
        setUser(data.user);

        // Then verify the server can read the cookie by calling /api/auth/me
        // This confirms the cookie round-trip works before we redirect
        try {
          const meRes = await fetch('/api/auth/me', {
            method: 'GET',
            credentials: 'include',
          });
          if (meRes.ok) {
            const meData = await meRes.json();
            if (meData.user) {
              setUser(meData.user);
              return { success: true, user: meData.user };
            }
          }
        } catch {}

        // Fallback: use login response data directly
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error || 'Login failed. Please check your credentials.' };
      }
    } catch (error) {
      return { success: false, error: 'Connection error. The server might be offline or undergoing maintenance.' };
    }
  }, []);

  const logout = React.useCallback(async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch {}
    setUser(null);
    // Hard redirect to clear any protected page state
    window.location.href = '/owner-login';
  }, []);

  const updateUser = React.useCallback((userData: Partial<AuthUser>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  // Debug logging
  
  
  
  return context;
}
