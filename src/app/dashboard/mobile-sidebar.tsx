
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Brain, Home, FileUp, Users, Settings, PanelLeft, MessageSquare, Landmark, UserCheck, CalendarCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ASLogo } from '@/components/as-logo';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/upload-property/select-type', label: 'Upload Property', icon: FileUp },
  { href: '/dashboard/registrations', label: 'Registrations', icon: UserCheck },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/dashboard/contacts', label: 'Contacts', icon: Landmark },
  { href: '/dashboard/users', label: 'Manage Logins', icon: Users },
  { href: '/dashboard/site-visits', label: 'Site Visits', icon: CalendarCheck },
  { href: '/ai-management', label: 'AI Control', icon: Brain },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export default function MobileSidebar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6 md:hidden mb-4 -mx-4">
         <Link href="/" className="flex items-center space-x-2">
            <ASLogo className="h-8 w-8 text-primary" />
            <span className="font-semibold sm:inline-block font-headline">
              OWNER
            </span>
        </Link>
        <Sheet>
            <SheetTrigger asChild>
                <Button size="icon" variant="outline">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
                <nav className="grid gap-6 text-lg font-medium">
                     <Link href="/" className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base">
                        <ASLogo className="h-6 w-6 transition-all group-hover:scale-110" />
                        <span className="sr-only">AS Trusted Consultancy</span>
                    </Link>
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                            'flex items-center gap-4 px-2.5',
                            pathname === item.href
                                ? 'text-foreground'
                                : 'text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </SheetContent>
        </Sheet>
    </header>
  );
}
