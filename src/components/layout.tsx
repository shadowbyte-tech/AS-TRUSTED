'use client';

import WhatsAppButton from '@/components/whatsapp-button';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {children}
      <WhatsAppButton />
    </>
  );
}
