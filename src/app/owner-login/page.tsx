'use client';

import { Suspense } from 'react';
import LoginForm from '@/components/login-form';

/**
 * Owner login page.
 *
 * `src/middleware.ts` redirects protected `/dashboard` routes here when the user
 * has no auth cookies. Without this route, users hit a 404.
 */
export default function OwnerLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

