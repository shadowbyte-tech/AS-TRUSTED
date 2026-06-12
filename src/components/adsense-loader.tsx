'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const ENABLED_EXACT_PATHS = new Set([
  '/',
  '/about',
  '/services',
  '/faq',
  '/privacy',
  '/terms',
  '/cookies',
  '/blog',
  '/book-site-visit',
  '/financial-services',
]);

const ENABLED_PREFIXES = [
  '/blog/',
];

export default function AdSenseLoader() {
  const pathname = usePathname() || '/';

  const shouldLoadAdsense =
    ENABLED_EXACT_PATHS.has(pathname) ||
    ENABLED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!shouldLoadAdsense) {
    return null;
  }

  return (
    <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5789918917071865"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
