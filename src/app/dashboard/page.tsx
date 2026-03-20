'use client';

import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      window.location.href = '/login';
    }
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome back, {user.name || user.email}!
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            This is your Executive Dashboard
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-amber-50 rounded-xl p-6 border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Properties</h3>
              <p className="text-3xl font-bold text-amber-600">0</p>
              <p className="text-sm text-amber-600">Total properties</p>
            </div>
            
            <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Inquiries</h3>
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-blue-600">Total inquiries</p>
            </div>
            
            <div className="bg-green-50 rounded-xl p-6 border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Registrations</h3>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-green-600">Total registrations</p>
            </div>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={() => window.location.href = '/properties'}
                className="bg-amber-600 text-white px-6 py-3 rounded-xl hover:bg-amber-700 transition-colors font-semibold"
              >
                View Properties
              </button>
              <button 
                onClick={() => window.location.href = '/upload-property/select-type'}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-semibold"
              >
                Upload Property
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
