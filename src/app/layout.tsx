import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Space_Grotesk, Cinzel } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';

// Import the ClientWidgets wrapper (standard import is fine because the component itself handles dynamic loading)
import ClientWidgets from '@/components/client-widgets';
import AICoPilot from '@/components/ai-copilot';
import GlobalLeadModal from '@/components/global-lead-modal';
import AppInstallPopup from '@/components/app-install-popup';
import Script from 'next/script';

// Optimized font configuration with display: swap
const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-sans',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'], 
  weight: ['300', '400', '500', '600', '700'], 
  variable: '--font-headline',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

const cinzel = Cinzel({ 
  subsets: ['latin'], 
  weight: ['400', '700', '900'], 
  variable: '--font-serif',
  display: 'swap',
  preload: true,
  fallback: ['serif'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://astrustedconsultancy.com'),
  title: "AS Trusted Consultancy | Plots, Lands & Real Estate in Telangana",
  description: "AS Trusted Consultancy provides trusted real estate services in Telangana including DTCP approved plots, residential plots, commercial lands, farm lands, open plots, villa plots, gated community plots, investment properties, and real estate consultancy services in Kamareddy, Hyderabad, and nearby areas.",
  keywords: [
    "AS Trusted Consultancy",
    "real estate Telangana",
    "plots in Kamareddy",
    "open plots for sale",
    "DTCP approved plots",
    "farm lands Telangana",
    "real estate consultancy",
    "land for sale",
    "villa plots",
    "commercial plots",
    "residential plots",
    "investment properties",
    "plots near Hyderabad",
    "property dealers Telangana",
    "real estate agents Kamareddy",
    "buy plots in Telangana",
    "highway facing plots",
    "gated community plots",
    "real estate services",
    "property investment",
    "trusted property consultants",
    "plots for investment",
    "real estate company",
    "premium plots Telangana",
  ],
  authors: [{ name: 'AS Trusted' }],
  creator: 'AS Trusted',
  publisher: 'AS Trusted',
  robots: 'index, follow',
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astrustedconsultancy.com',
    siteName: 'AS Trusted',
    title: 'AS Trusted — Premium Real Estate & Strategic Land Investments',
    description: 'Institutional-grade land investments in Telangana\'s highest-growth corridors. DTCP-approved, legally verified, with proven 80%+ ROI for discerning investors.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AS Trusted — Premium Real Estate & Strategic Land Investments',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AS Trusted — Premium Real Estate & Strategic Land Investments',
    description: 'Institutional-grade land investments in Telangana\'s highest-growth corridors. DTCP-approved, legally verified, with proven 80%+ ROI.',
    images: ['/images/twitter-image.jpg'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.png',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180' },
    ],
  },
  manifest: '/site.webmanifest',
  other: {
    'theme-color': '#D4AF37',
    'msapplication-TileColor': '#D4AF37',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#D4AF37',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//www.googletagmanager.com" />
        <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
        
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5789918917071865"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Prevent layout shift */
            .skeleton {
              background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
              background-size: 200% 100%;
              animation: loading 1.5s infinite;
            }
            @keyframes loading {
              0% { background-position: 200% 0; }
              100% { background-position: -200% 0; }
            }
            
            /* Optimize font loading */
            .fonts-loaded * {
              font-display: swap;
            }
            
            /* Smooth scrolling */
            html {
              scroll-behavior: smooth;
            }
            
            /* Reduce motion for accessibility */
            @media (prefers-reduced-motion: reduce) {
              * {
                animation-duration: 0.01ms !important;
                animation-iteration-count: 1 !important;
                transition-duration: 0.01ms !important;
              }
            }
          `
        }} />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-sans antialiased',
          inter.variable,
          spaceGrotesk.variable,
          cinzel.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
            <ClientWidgets />
            <AICoPilot />
            <GlobalLeadModal />
            <AppInstallPopup />
          </AuthProvider>
        </ThemeProvider>
        
        {/* Performance monitoring script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // Monitor Core Web Vitals
            if ('performance' in window) {
              new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  if (entry.entryType === 'largest-contentful-paint') {
                    // LCP recorded
                  }
                  if (entry.entryType === 'layout-shift') {
                    // CLS recorded
                  }
                  if (entry.entryType === 'first-input') {
                    // FID recorded
                  }
                }
              }).observe({ entryTypes: ['largest-contentful-paint', 'layout-shift', 'first-input'] });
            }
            
            // Service Worker registration
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {
                  // Service worker registration failed
                });
              });
            }
          `
        }} />
      </body>
    </html>
  );
}
