'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (response.ok && data.user) {
        setUser(data.user);
      } else {
        window.location.href = '/login';
      }
    } catch (error) {
      window.location.href = '/login';
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Redirecting to login...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">AS Trusted Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-96 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Dashboard Content</h2>
              <p className="text-gray-600 mb-2">User Role: {user.role}</p>
              <p className="text-gray-600 mb-4">User ID: {user.id}</p>
              <div className="space-y-2">
                <div className="bg-green-100 text-green-800 p-3 rounded">
                  ✅ Authentication Working
                </div>
                <div className="bg-blue-100 text-blue-800 p-3 rounded">
                  📊 Database Connected
                </div>
                <div className="bg-purple-100 text-purple-800 p-3 rounded">
                  🚀 MongoDB Ready
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
