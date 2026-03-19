'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ASLogo } from '@/components/as-logo';
import { 
  LogOut, 
  UserPlus, 
  User, 
  UserCog, 
  PanelLeft,
  Menu,
  X,
  Crown
} from 'lucide-react';

export function SimpleHeader() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const AuthButtons = () => {
    if (isLoading) return <div className="h-10 w-48 animate-pulse rounded-full bg-muted" />;

    if (user) {
      return (
        <div className="flex items-center gap-3">
          {user.role === 'Owner' && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex rounded-full hover:bg-accent/5 hover:text-accent transition-all">
              <Link href="/admin">
                <PanelLeft className="mr-2 h-4 w-4" />
                Admin Portal
              </Link>
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline" className="rounded-full hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )
    }

    return (
      <div className="flex items-center gap-3">
        <Button 
          asChild 
          className="enterprise-button-primary"
        >
          <Link href="/register" className="flex items-center justify-center gap-2 h-full w-full">
            <UserPlus className="h-4 w-4 text-white" />
            <span className="enterprise-text-primary">Get Started</span>
          </Link>
        </Button>
        
        <Button 
          asChild 
          className="enterprise-button-secondary"
        >
          <Link href="/user-login" className="flex items-center justify-center gap-2 h-full w-full">
            <User className="h-4 w-4 text-white" />
            <span className="enterprise-text-premium">Premium Access</span>
          </Link>
        </Button>
        
        <Button 
          asChild 
          className="enterprise-button-secondary"
        >
          <Link href="/login" className="flex items-center justify-center gap-2 h-full w-full">
            <UserCog className="h-4 w-4 text-white" />
            <span className="enterprise-text-secondary">Executive Portal</span>
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4 group" aria-label="AS Trusted Consultancy - Home">
            <div className="relative">
              {/* Premium glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-2xl rounded-full group-hover:from-amber-400/50 group-hover:to-orange-500/50 transition-all duration-700" aria-hidden="true"></div>
              <div className="relative">
                <ASLogo className="h-10 w-10" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                AS Trusted
              </span>
              <span className="text-xl font-semibold text-foreground">
                Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6" aria-label="Main navigation">
            <Link 
              href="/" 
              className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200 relative group"
              aria-label="Home page"
            >
              Home
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-200" aria-hidden="true"></span>
            </Link>
            <Link 
              href="/about" 
              className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200 relative group"
              aria-label="About us"
            >
              About
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-200" aria-hidden="true"></span>
            </Link>
            <Link 
              href="/services" 
              className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200 relative group"
              aria-label="Our services"
            >
              Services
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-200" aria-hidden="true"></span>
            </Link>
            <Link 
              href="/properties" 
              className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200 relative group"
              aria-label="Property listings"
            >
              Properties
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-amber-600 group-hover:w-full transition-all duration-200" aria-hidden="true"></span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>

          {/* Authentication Buttons and Theme Toggle */}
          <div className="hidden sm:flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-4">
              <AuthButtons />
            </div>
            <div className="h-6 w-px bg-white/10 hidden sm:block" aria-hidden="true" />
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Navigation Panel */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex flex-col space-y-4" aria-label="Mobile navigation">
              <Link 
                href="/" 
                className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200"
                aria-label="Home page"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200"
                aria-label="About us"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/services" 
                className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200"
                aria-label="Our services"
                onClick={() => setMobileMenuOpen(false)}
              >
                Services
              </Link>
              <Link 
                href="/properties" 
                className="text-lg font-bold text-foreground hover:text-amber-600 transition-colors duration-200"
                aria-label="Property listings"
                onClick={() => setMobileMenuOpen(false)}
              >
                Properties
              </Link>
              
              <div className="pt-4 border-t">
                {user ? (
                  <AuthButtons />
                ) : (
                  <div className="space-y-3">
                    <p className="text-[10px] text-muted-foreground/60 uppercase tracking-widest font-bold px-1">Quick Access</p>
                    <div className="grid grid-cols-1 gap-2">
                       <Link
                        href="/register"
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-white bg-amber-600 hover:bg-amber-700"
                      >
                        <UserPlus className="h-5 w-5" />
                        <span className="font-bold">Get Started</span>
                      </Link>
                      <div className="grid grid-cols-2 gap-2">
                         <Link
                          href="/user-login"
                          className="flex flex-col items-center justify-center p-3 rounded-xl transition-all text-amber-500 bg-amber-500/10 border border-amber-500/20"
                        >
                          <Crown className="h-5 w-5 mb-1" />
                          <span className="text-[10px] font-black uppercase">Premium</span>
                        </Link>
                         <Link
                          href="/login"
                          className="flex flex-col items-center justify-center p-3 rounded-xl transition-all text-blue-400 bg-blue-400/10 border border-blue-400/20"
                        >
                          <UserCog className="h-5 w-5 mb-1" />
                          <span className="text-[10px] font-black uppercase">Executive</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex justify-center">
                <ThemeToggle />
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
