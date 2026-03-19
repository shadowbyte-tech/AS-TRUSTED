'use client';

import Link from 'next/link';
import { ASLogo } from './as-logo';

export function StaticHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group">
            <div className="relative">
              {/* Premium glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-2xl rounded-full group-hover:from-amber-400/50 group-hover:to-orange-500/50 transition-all duration-700"></div>
              <div className="relative">
                <ASLogo className="h-10 w-10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                AS Trusted
              </span>
              <span className="text-xl font-semibold text-gray-800">
                Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/premium-dashboard" 
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Premium Dashboard
            </Link>
            <Link 
              href="/properties" 
              className="text-sm font-medium text-gray-600 hover:text-blue-600 transition-colors"
            >
              Properties
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
