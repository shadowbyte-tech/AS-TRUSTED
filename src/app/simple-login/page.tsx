'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SimpleLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Hardcoded authentication on client side
    const validUsers = [
      { email: 'owner@astrustedconsultancy.com', password: 'manikanta@2775', role: 'Owner', name: 'Owner User', id: 'owner-001' },
      { email: 'swamy@consult.com', password: 'manikanta@2775', role: 'Owner', name: 'Swamy Goud', id: 'swamy-001' },
      { email: 'admin@astrustedconsultancy.com', password: 'admin123', role: 'Owner', name: 'Admin User', id: 'admin-001' }
    ];

    const user = validUsers.find(u => u.email === email && u.password === password);

    if (user) {
      // Store in localStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('isLoggedIn', 'true');
      
      setMessage('✅ Login successful! Redirecting...');
      
      // Redirect to owner-login after 2 seconds
      setTimeout(() => {
        router.push('/owner-login');
      }, 2000);
    } else {
      setMessage('❌ Invalid credentials');
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Executive Portal Login
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your credentials to access the administrative dashboard
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {message && (
            <div className={`text-center text-sm ${message.includes('✅') ? 'text-green-600' : 'text-red-600'}`}>
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Owner Credentials:
            </p>
            <p className="text-xs text-gray-500">
              owner@astrustedconsultancy.com / manikanta@2775
            </p>
            <p className="text-xs text-gray-500">
              swamy@consult.com / manikanta@2775
            </p>
            <p className="text-xs text-gray-500">
              admin@astrustedconsultancy.com / admin123
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
