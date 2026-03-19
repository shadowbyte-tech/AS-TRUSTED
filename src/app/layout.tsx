import type { Metadata, Viewport } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { AuthProvider } from '@/lib/auth-context';
import { Toaster } from "@/components/ui/toaster"
import { Inter, Space_Grotesk, Cinzel } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import dynamic from 'next/dynamic';
import { SpeedInsights } from '@vercel/speed-insights/next';

// Import the ClientWidgets wrapper (standard import is fine because the component itself handles dynamic loading)
import ClientWidgets from '@/components/client-widgets';

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
  title: {
    default: 'AS Trusted Consultancy - Premium Real Estate Services',
    template: '%s | AS Trusted Consultancy'
  },
  description: 'Discover premium real estate investment opportunities with AS Trusted Consultancy. Expert property management, advanced analytics, and AI-powered insights for smart investors.',
  keywords: ['real estate', 'property investment', 'consultancy', 'analytics', 'premium properties', 'AS Trusted'],
  authors: [{ name: 'AS Trusted Consultancy' }],
  creator: 'AS Trusted Consultancy',
  publisher: 'AS Trusted Consultancy',
  robots: 'index, follow',
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://astrustedconsultancy.com',
    siteName: 'AS Trusted Consultancy',
    title: 'AS Trusted Consultancy - Premium Real Estate Services',
    description: 'Discover premium real estate investment opportunities with AS Trusted Consultancy. Expert property management, advanced analytics, and AI-powered insights.',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AS Trusted Consultancy - Premium Real Estate Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AS Trusted Consultancy - Premium Real Estate Services',
    description: 'Discover premium real estate investment opportunities with AS Trusted Consultancy. Expert property management, advanced analytics, and AI-powered insights.',
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
    'theme-color': '#f59e0b',
    'msapplication-TileColor': '#f59e0b',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  viewportFit: 'cover',
  themeColor: '#f59e0b',
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <Toaster />
            <ClientWidgets />
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
        
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
