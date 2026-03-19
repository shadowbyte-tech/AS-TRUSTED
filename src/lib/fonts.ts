import { Inter, Cinzel } from 'next/font/google';

// Optimized font configuration for performance
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
});

export const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
  preload: true,
  fallback: ['serif'],
});

// Font classes for Tailwind
export const fontClasses = {
  sans: 'font-sans antialiased',
  serif: 'font-serif antialiased',
  heading: 'font-heading antialiased',
};
