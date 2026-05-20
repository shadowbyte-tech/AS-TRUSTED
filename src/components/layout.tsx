'use client';

import QuickActionDock from '@/components/quick-action-dock';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <QuickActionDock />
    </>
  );
}
