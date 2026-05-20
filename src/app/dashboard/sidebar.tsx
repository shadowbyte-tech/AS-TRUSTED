
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, FileUp, Users, Settings, MessageSquare, Landmark, UserCheck, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ASLogo } from '@/components/as-logo';

export default function DashboardSidebar({ newRegistrationCount }: { newRegistrationCount: number }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/upload-property/select-type', label: 'Upload Property', icon: FileUp },
    { href: '/dashboard/registrations', label: 'Registrations', icon: UserCheck, notificationCount: newRegistrationCount },
    { href: '/dashboard/site-visits', label: 'Site Visits', icon: CalendarCheck },
    { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
    { href: '/dashboard/contacts', label: 'Contacts', icon: Landmark },
    { href: '/dashboard/users', label: 'Manage Logins', icon: Users },
    { href: '/ai-management', label: 'AI Control', icon: Brain },
    { href: '/dashboard/settings', label: 'Settings', icon: Settings },
  ];


  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex relative z-20">
      <div className="flex items-center space-x-2 mb-8">
        <Link href="/" className="flex items-center space-x-2">
            <ASLogo className="h-8 w-8 text-primary" />
            <span className="font-semibold sm:inline-block font-headline">
              OWNER
            </span>
        </Link>
      </div>
      <nav className="flex flex-col space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors relative',
              pathname === item.href
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:bg-muted'
            )}
          >
            <item.icon className="mr-3 h-5 w-5" />
            <span>{item.label}</span>
             {item.notificationCount && item.notificationCount > 0 && (
              <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-bold text-destructive-foreground">
                {item.notificationCount}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
