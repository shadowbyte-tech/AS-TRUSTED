'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  CalendarCheck, ChevronDown, LogOut, PanelLeft, MapPin, X,
  LayoutDashboard, UserCheck, MessageSquare, Landmark, Users as UsersIcon, 
  Settings, FileUp, UserPlus, Crown, UserCog, Menu, ArrowRight
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { ASLogo } from './as-logo';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useState, useEffect } from 'react';

const publicNavItems = [
  { href: '/', label: 'Home', icon: MapPin },
  { href: '/properties', label: 'Properties', icon: MapPin },
  { href: '/about', label: 'About', icon: PanelLeft },
  { href: '/services', label: 'Services', icon: LayoutDashboard },
  { href: '/book-site-visit', label: 'Site Visit', icon: CalendarCheck },
];

const dashboardNavItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/upload-property/select-type', label: 'Upload Property', icon: FileUp },
  { href: '/dashboard/registrations', label: 'Registrations', icon: UserCheck },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Landmark },
  { href: '/dashboard/users', label: 'Manage Logins', icon: UsersIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Header() {
  const { user, logout, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isAuthPage = pathname.startsWith('/user-login') || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/ai-access');
  const isDashboardPage = pathname.startsWith('/dashboard') || pathname.startsWith('/upload-property') || pathname.startsWith('/owner-portal') || pathname.startsWith('/ai-management');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const LogoAndBrand = () => (
    <Link href="/" className="flex items-center space-x-3 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/40 to-gold-light/40 blur-2xl rounded-full group-hover:from-gold/60 group-hover:to-gold-light/60 transition-all duration-700" />
        <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#0B0B0B] flex items-center justify-center transition-all duration-700 group-hover:scale-105">
          <ASLogo className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg sm:text-xl font-serif tracking-wide leading-none text-gold group-hover:text-gold-light transition-all duration-500 uppercase">
          AS <span className="text-gold-light font-extrabold">TRUSTED</span>
        </span>
        <span className="text-[10px] font-light text-gold/70 uppercase tracking-[0.2em] leading-none mt-1">
          Premium Real Estate
        </span>
      </div>
    </Link>
  );

  const AuthButtons = () => {
    if (isLoading) return <div className="h-10 w-36 animate-pulse rounded-full bg-white/5" />

    if (user) {
      return (
        <div className="flex items-center gap-3">
          {user.role === 'Owner' && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex rounded-full hover:bg-gold/10 hover:text-gold transition-all text-white/80">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline" className="rounded-full hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30 transition-all border-white/15 text-white/80">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )
    }

    return (
      <div className="hidden md:flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              size="sm"
              variant="ghost"
              className="h-10 rounded-full px-4 text-xs font-bold uppercase tracking-[0.14em] text-white/60 hover:bg-white/5 hover:text-gold"
            >
              Access
              <ChevronDown className="h-3.5 w-3.5 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl border-gold/20 bg-navy/95 backdrop-blur-xl p-2 text-white">
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-gold/10 focus:text-gold">
              <Link href="/user-login" className="flex items-center gap-3">
                <Crown className="h-4 w-4 text-gold" />
                <span className="font-medium">Investor Portal</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild className="cursor-pointer rounded-lg px-3 py-2.5 focus:bg-blue-500/10 focus:text-blue-300">
              <Link href="/login" className="flex items-center gap-3">
                <UserCog className="h-4 w-4 text-blue-400" />
                <span className="font-medium">Executive Login</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button asChild size="sm" className="h-10 rounded-full bg-gold px-5 text-xs font-black uppercase tracking-[0.12em] text-black hover:bg-gold-light shadow-lg shadow-gold/20">
          <Link href="/register" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Get Started
          </Link>
        </Button>
      </div>
    );
  };

  if (isAuthPage) return null;

  return (
    <header 
      className={cn(
        isDashboardPage ? 'relative z-[90] bg-navy/90 border-b border-gold/10' : 'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
        !isDashboardPage && scrolled 
          ? 'bg-navy/90 backdrop-blur-xl border-b border-gold/10 shadow-lg shadow-black/20' 
          : !isDashboardPage ? 'bg-transparent' : ''
      )}
    >
      {/* Premium Gold Accent Line */}
      <div className={cn(
        'h-[1.5px] w-full transition-all duration-700',
        (!isDashboardPage && scrolled) || isDashboardPage
          ? 'bg-gradient-to-r from-transparent via-gold/40 to-transparent' 
          : 'bg-gradient-to-r from-transparent via-gold/20 to-transparent'
      )} />
      
      <div className="container flex h-[80px] items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Mobile Menu Trigger */}
          <div className="lg:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <Button 
                size="icon" 
                variant="ghost" 
                className="mr-1 hover:bg-white/5 h-11 w-11 min-w-[44px] rounded-full transition-all"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6 text-white/80" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
              <SheetContent side="left" className="sm:max-w-sm border-gold/10 w-[85vw] p-0 bg-navy/98 backdrop-blur-2xl">
                <div className="flex flex-col h-full">
                  <div className="p-6 border-b border-white/5">
                    <div className="flex items-center justify-between">
                      <LogoAndBrand />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-9 w-9 rounded-full hover:bg-white/5"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <X className="h-5 w-5 text-white/60" />
                      </Button>
                    </div>
                  </div>
                  
                  <nav className="flex-1 px-4 py-6 overflow-y-auto scrollbar-thin">
                    <Link
                      href="/properties"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mb-6 flex items-center justify-between rounded-xl bg-gold/15 px-5 py-4 text-gold border border-gold/20 group"
                    >
                      <div>
                        <span className="font-bold text-sm">Explore Properties</span>
                        <p className="text-xs text-gold/60 mt-0.5">Browse premium listings</p>
                      </div>
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>

                    <p className="px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-gold/40 mb-4">Navigation</p>
                    <div className="space-y-1">
                      {publicNavItems.map((item) => {
                        const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/');
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all',
                              isActive
                                ? 'bg-gold/10 text-gold border border-gold/15'
                                : 'text-white/60 hover:bg-white/5 hover:text-white'
                            )}
                          >
                            <item.icon className={cn("h-4 w-4", isActive ? "text-gold" : "text-white/40")} />
                            <span className="font-semibold text-sm">{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {user?.role === 'Owner' && (
                      <>
                        <p className="px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-blue-400/40 mt-8 mb-4">Management</p>
                        <div className="space-y-1">
                          {dashboardNavItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={cn(
                                'flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all',
                                pathname === item.href
                                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/15'
                                  : 'text-white/60 hover:bg-white/5 hover:text-white'
                              )}
                            >
                              <item.icon className="h-4 w-4 text-white/40" />
                              <span className="font-semibold text-sm">{item.label}</span>
                            </Link>
                          ))}
                        </div>
                      </>
                    )}
                  </nav>

                  <div className="p-6 bg-white/[0.02] border-t border-white/5">
                    {user ? (
                      <Button
                        onClick={handleLogout}
                        variant="ghost"
                        className="w-full h-12 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-3 font-semibold text-sm"
                      >
                        <LogOut className="h-5 w-5" />
                        Sign Out
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <Button asChild className="w-full h-12 rounded-xl bg-gold hover:bg-gold-light text-black font-bold text-sm shadow-lg shadow-gold/20">
                          <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                        </Button>
                        <Button asChild variant="outline" className="w-full h-11 rounded-xl border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10 font-semibold text-xs">
                          <Link href="/book-site-visit" onClick={() => setIsMobileMenuOpen(false)}>
                            <CalendarCheck className="h-4 w-4 mr-2" />
                            Book Site Visit
                          </Link>
                        </Button>
                        <div className="grid grid-cols-2 gap-2">
                          <Button asChild variant="outline" className="h-11 rounded-xl border-gold/20 text-gold hover:bg-gold/10 font-semibold text-[10px] uppercase tracking-wider">
                            <Link href="/user-login" onClick={() => setIsMobileMenuOpen(false)}>Investor Login</Link>
                          </Button>
                          <Button asChild variant="outline" className="h-11 rounded-xl border-blue-500/20 text-blue-400 hover:bg-blue-500/10 font-semibold text-[10px] uppercase tracking-wider">
                            <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>Executive</Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          
          <LogoAndBrand />
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/5 bg-white/[0.02] p-1">
            {publicNavItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href) && item.href !== '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] transition-all',
                    isActive
                      ? 'bg-gold text-black shadow-sm shadow-gold/30'
                      : 'text-white/60 hover:bg-white/5 hover:text-gold'
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center gap-3">
            <AuthButtons />
            <div className="h-5 w-px bg-white/10 mx-1 hidden sm:block" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
