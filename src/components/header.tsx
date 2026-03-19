'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { 
  Home, LogOut, PanelLeft, MapPin, ShieldCheck, Info, User, Star, 
  LayoutDashboard, UserCheck, MessageSquare, Landmark, Users as UsersIcon, 
  Settings, FileUp, UserPlus, Crown, Brain, UserCog 
} from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';
import { ASLogo } from './as-logo';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { useState } from 'react';

const publicNavItems = [
  { href: '/', label: 'Home', icon: Home },
  { href: '/properties', label: 'Explore Plots', icon: MapPin },
  { href: '/ai-access', label: 'AI Features', icon: Brain },
  { href: '/services', label: 'Our Services', icon: ShieldCheck },
  { href: '/about', label: 'Elite Legacy', icon: Info },
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

  const isDashboard = pathname.startsWith('/dashboard') || pathname.startsWith('/premium-dashboard');
  const isPlotsPage = pathname.startsWith('/properties/') || pathname === '/properties';
  const isHomePage = pathname === '/';
  const isAuthPage = pathname.startsWith('/user-login') || pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/ai-access');

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const LogoAndBrand = () => (
    <Link href="/" className="flex items-center space-x-4 group">
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-400/30 to-orange-500/30 blur-2xl rounded-full group-hover:from-amber-400/50 group-hover:to-orange-500/50 transition-all duration-700" />
        <div className="relative h-14 w-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-700 group-hover:scale-105 group-hover:shadow-3xl group-hover:shadow-amber-500/20">
          <ASLogo className="h-10 w-10" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="font-bold text-lg sm:text-xl lg:text-2xl font-serif tracking-wide leading-none text-white group-hover:text-amber-300 transition-all duration-500 drop-shadow-lg uppercase text-nowrap">
          AS <span className="text-amber-400 font-extrabold">TRUSTED</span>
        </span>
        <span className="text-[11px] font-light text-amber-300/90 uppercase tracking-[0.3em] leading-none mt-1.5 drop-shadow text-nowrap">
          Consultancy Services
        </span>
      </div>
    </Link>
  );

  const AuthButtons = () => {
    if (isLoading) return <div className="h-10 w-48 animate-pulse rounded-full bg-muted" />

    if (user) {
      return (
        <div className="flex items-center gap-3">
          {user.role === 'Owner' && (
            <Button asChild variant="ghost" className="hidden sm:inline-flex rounded-full hover:bg-accent/5 hover:text-accent transition-all text-white">
              <Link href="/dashboard">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </Link>
            </Button>
          )}
          <Button onClick={handleLogout} variant="outline" className="rounded-full hover:bg-destructive/5 hover:text-destructive hover:border-destructive/30 transition-all border-white/20 text-white">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      )
    }

    if (isPlotsPage) {
      return (
        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="rounded-full bg-amber-600 hover:bg-amber-700 text-white font-black uppercase tracking-widest text-[10px] h-10 px-6">
            <Link href="/register">Register</Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-full border-amber-500/30 text-amber-200 font-black uppercase tracking-widest text-[10px] h-10 px-6">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      )
    }

    return (
      <div className="hidden md:flex items-center gap-3">
        <Button asChild size="sm" className="h-10 px-6 rounded-full bg-amber-600 hover:bg-amber-700 text-white font-bold uppercase tracking-wider text-[10px]">
          <Link href="/register">Get Started</Link>
        </Button>
        <Button asChild size="sm" className="h-10 px-6 rounded-full bg-slate-900 border border-amber-500/30 text-amber-400 font-bold uppercase tracking-wider text-[10px]">
          <Link href="/user-login">Premium Access</Link>
        </Button>
        <Button asChild size="sm" variant="ghost" className="h-10 px-4 rounded-full text-blue-400 hover:bg-blue-400/5 font-bold uppercase tracking-wider text-[10px]">
          <Link href="/login">Executive Portal</Link>
        </Button>
      </div>
    )
  }

  if (isAuthPage) return null;

  return (
    <header className="sticky top-0 z-[100] w-full border-b border-amber-500/10 backdrop-blur-3xl bg-black/70 transition-all duration-500 overflow-visible">
      {/* Decorative Top Line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-amber-600 via-amber-200 to-amber-600 shadow-[0_0_20px_rgba(245,158,11,0.5)]" />
      
      <div className="container flex h-20 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          {/* Side Panel Trigger for Mobile */}
          {!isAuthPage && (
            <div className="lg:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <Button 
                  size="icon" 
                  variant="ghost" 
                  className="mr-2 hover:bg-white/5 h-12 w-12 min-w-[48px] rounded-full bg-amber-500 hover:bg-amber-400 text-white transition-all relative z-[150]"
                  onClick={() => setIsMobileMenuOpen(true)}
                >
                  <PanelLeft className="h-7 w-7" />
                  <span className="sr-only">Toggle Menu</span>
                </Button>
                <SheetContent side="left" className="sm:max-w-xs glass-dark-2 border-white/10 overflow-y-auto w-[85vw] p-0 border-r-amber-500/20 relative z-[150]">
                  <div className="flex flex-col h-full bg-zinc-950/95">
                    <div className="p-8 border-b border-white/5">
                      <LogoAndBrand />
                    </div>
                    
                    <nav className="flex-1 px-4 py-8 overflow-y-auto scrollbar-none">
                      <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-amber-500/60 mb-6">Navigation</p>
                      <div className="space-y-2">
                        {publicNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={cn(
                              'flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group',
                              pathname === item.href
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                            )}
                          >
                            <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-amber-500" : "text-zinc-500 group-hover:text-amber-400 transition-colors")} />
                            <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                          </Link>
                        ))}
                      </div>

                      {user?.role === 'Owner' && (
                        <div className="mt-10">
                          <p className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-blue-500/60 mb-6">Owner Console</p>
                          <div className="space-y-2">
                            {dashboardNavItems.map((item) => (
                              <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                  'flex items-center gap-4 px-4 py-4 rounded-2xl transition-all group',
                                  pathname === item.href
                                    ? 'bg-blue-500/10 text-blue-500 border border-blue-500/20'
                                    : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                                )}
                              >
                                <item.icon className="h-5 w-5 text-zinc-500 group-hover:text-blue-400 transition-colors" />
                                <span className="font-bold uppercase tracking-widest text-xs">{item.label}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </nav>

                    <div className="p-6 bg-zinc-900/50 border-t border-white/5">
                       {user ? (
                         <Button
                           onClick={handleLogout}
                           variant="ghost"
                           className="w-full h-14 rounded-2xl text-red-400 hover:bg-red-500/10 hover:text-red-300 gap-3 font-bold uppercase tracking-wider text-xs"
                         >
                           <LogOut className="h-5 w-5" />
                           Sign Out
                         </Button>
                       ) : (
                         <div className="space-y-3">
                            <Button asChild className="w-full h-14 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black uppercase tracking-widest text-xs">
                              <Link href="/register" onClick={() => setIsMobileMenuOpen(false)}>Get Started</Link>
                            </Button>
                            <div className="grid grid-cols-2 gap-2">
                              <Button asChild variant="outline" className="h-12 rounded-xl border-amber-500/20 text-amber-500 hover:bg-amber-500/10 font-black uppercase tracking-tighter text-[10px]">
                                <Link href="/user-login" onClick={() => setIsMobileMenuOpen(false)}>Premium</Link>
                              </Button>
                              <Button asChild variant="outline" className="h-12 rounded-xl border-blue-500/20 text-blue-400 hover:bg-blue-500/10 font-black uppercase tracking-tighter text-[10px]">
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
          )}
          
          <LogoAndBrand />
        </div>

        <div className="flex items-center gap-4 lg:gap-8">
          <nav className="hidden lg:flex items-center gap-8">
            {(isHomePage ? ['Properties', 'Services', 'About'] : ['Home', 'Properties', 'Services', 'About']).map((item) => (
              <Link
                key={item}
                href={item === 'Home' ? '/' : item === 'Properties' ? '/properties' : `/${item.toLowerCase()}`}
                className="text-xs font-black uppercase tracking-[0.2em] text-zinc-400 hover:text-amber-500 transition-all relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-amber-500 transition-all duration-500 group-hover:w-full" />
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center gap-3">
            <AuthButtons />
            <div className="h-6 w-[1px] bg-white/10 mx-2 hidden sm:block" />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
