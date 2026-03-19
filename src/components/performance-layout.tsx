'use client';

import { useEffect, useState } from 'react';
import { Head } from 'next/document';

interface PerformanceLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  openGraph?: {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
    type?: string;
  };
}

export default function PerformanceLayout({
  children,
  title = 'AS Trusted Consultancy - Premium Real Estate Services',
  description = 'Discover premium real estate investment opportunities with AS Trusted Consultancy. Expert property management, analytics, and AI-powered insights.',
  keywords = 'real estate, property investment, consultancy, analytics, premium properties',
  canonical,
  openGraph,
}: PerformanceLayoutProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Preload critical resources
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // Service worker registration failed
      });
    }

    // Optimize font loading
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        document.body.classList.add('fonts-loaded');
      });
    }

    // Intersection Observer for lazy loading
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
              }
            }
          });
        },
        {
          rootMargin: '50px',
        }
      );

      document.querySelectorAll('img[data-src]').forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }, []);

  return (
    <>
      {/* Critical CSS for above-the-fold content */}
      <style jsx global>{`
        /* Critical CSS for immediate rendering */
        .critical-above-fold {
          display: block;
        }
        
        /* Optimize font display */
        @font-face {
          font-display: swap;
        }
        
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
        
        /* Optimize images */
        img {
          content-visibility: auto;
          contain-intrinsic-size: 400px 300px;
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
      `}</style>

      {/* Preload critical resources */}
      {isClient && (
        <>
          <link
            rel="preload"
            href="/fonts/inter-v12-latin-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
          <link
            rel="preload"
            href="/fonts/cinzel-v9-latin-regular.woff2"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        </>
      )}

      {/* Meta tags for SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="AS Trusted Consultancy" />
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      
      {/* Open Graph tags */}
      <meta property="og:title" content={openGraph?.title || title} />
      <meta property="og:description" content={openGraph?.description || description} />
      <meta property="og:image" content={openGraph?.image || '/images/og-image.jpg'} />
      <meta property="og:url" content={openGraph?.url || canonical || 'https://astrustedconsultancy.com'} />
      <meta property="og:type" content={openGraph?.type || 'website'} />
      <meta property="og:site_name" content="AS Trusted Consultancy" />
      
      {/* Twitter Card tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={openGraph?.title || title} />
      <meta name="twitter:description" content={openGraph?.description || description} />
      <meta name="twitter:image" content={openGraph?.image || '/images/twitter-image.jpg'} />
      
      {/* Canonical URL */}
      {canonical && <link rel="canonical" href={canonical} />}
      
      {/* Favicon and app icons */}
      <link rel="icon" href="/favicon.ico" sizes="any" />
      <link rel="icon" href="/icon.svg" type="image/svg+xml" />
      <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//analytics.google.com" />
      
      {/* Preconnect for critical domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Theme color */}
      <meta name="theme-color" content="#f59e0b" />
      <meta name="msapplication-TileColor" content="#f59e0b" />
      
      {/* Structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: 'AS Trusted Consultancy',
            description: description,
            url: 'https://astrustedconsultancy.com',
            logo: 'https://astrustedconsultancy.com/logo.png',
            contactPoint: {
              '@type': 'ContactPoint',
              telephone: '+91-XXXXXXXXXX',
              contactType: 'customer service',
            },
            sameAs: [
              'https://www.facebook.com/astrustedconsultancy',
              'https://www.twitter.com/astrustedconsultancy',
              'https://www.linkedin.com/company/astrustedconsultancy',
            ],
          }),
        }}
      />
      
      {/* Main content */}
      <div className="min-h-screen bg-background font-sans antialiased">
        <div className="critical-above-fold">
          {children}
        </div>
      </div>
    </>
  );
}
