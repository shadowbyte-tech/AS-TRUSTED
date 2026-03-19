'use client';

import { useAutoLogout } from '@/hooks/use-auto-logout';

export default function AutoLogoutWrapper({ children }: { children: React.ReactNode }) {
  useAutoLogout();
  
  return <>{children}</>;
}
