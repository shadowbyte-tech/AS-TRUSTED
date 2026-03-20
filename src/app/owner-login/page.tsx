'use client';

import { Suspense } from 'react';
import OwnerLoginForm from './owner-login-form';

export default function OwnerLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Portal - Restored</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    }>
      <OwnerLoginForm />
    </Suspense>
  );
}
