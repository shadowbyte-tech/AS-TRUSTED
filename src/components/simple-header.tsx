'use client';

import { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { ASLogo } from '@/components/as-logo';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  CalendarCheck,
  ChevronDown,
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
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/services', label: 'Services' },
  ];

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
              <Link href="/owner-portal">
                <PanelLeft className="mr-2 h-4 w-4" />
                Owner Portal
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
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="h-10 rounded-full px-4 text-sm font-semibold text-muted-foreground hover:bg-amber-500/10 hover:text-amber-700"
            >
              Access
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-amber-500/20 p-2">
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
              <Link href="/user-login" className="flex items-center gap-3">
                <User className="h-4 w-4 text-amber-600" />
                <span className="font-medium">Premium Access</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
              <Link href="/login" className="flex items-center gap-3">
                <UserCog className="h-4 w-4 text-sky-600" />
                <span className="font-medium">Executive Portal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5">
              <Link href="/book-site-visit" className="flex items-center gap-3">
                <CalendarCheck className="h-4 w-4 text-emerald-600" />
                <span className="font-medium">Book Site Visit</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild className="h-10 rounded-full bg-amber-600 px-5 text-sm font-bold text-white shadow-sm hover:bg-amber-700">
          <Link href="/register" className="flex items-center justify-center gap-2">
            <UserPlus className="h-4 w-4" />
            Get Started
          </Link>
        </Button>
      </div>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group" aria-label="AS Trusted Consultancy - Home">
            <div className="relative">
              {/* Premium glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-2xl rounded-full group-hover:from-amber-400/50 group-hover:to-orange-500/50 transition-all duration-700" aria-hidden="true"></div>
              <div className="relative overflow-hidden rounded-full bg-[#0B0B0B]">
                <ASLogo className="h-9 w-9" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold leading-tight bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                AS Trusted
              </span>
              <span className="text-lg font-semibold leading-tight text-foreground">
                Consultancy
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-border/60 bg-background/70 p-1 shadow-sm" aria-label="Main navigation">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-sm font-semibold transition-all',
                    isActive
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-muted-foreground hover:bg-amber-500/10 hover:text-amber-700'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
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
                href="/properties"
                className="flex items-center justify-between rounded-xl bg-amber-600 px-4 py-3 text-sm font-bold text-white shadow-sm"
                onClick={() => setMobileMenuOpen(false)}
              >
                Browse Properties
                <span className="text-xs opacity-80">Start here</span>
              </Link>
              {navItems.filter((item) => item.href !== '/properties').map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-xl px-4 py-3 text-sm font-semibold transition-colors',
                    pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
                      ? 'bg-amber-500/10 text-amber-700'
                      : 'text-foreground hover:bg-muted'
                  )}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              
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
                      <Link
                        href="/book-site-visit"
                        className="flex items-center gap-4 px-4 py-3 rounded-xl transition-all text-emerald-700 bg-emerald-500/10 border border-emerald-500/20"
                      >
                        <CalendarCheck className="h-5 w-5" />
                        <span className="font-bold">Book Site Visit</span>
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
