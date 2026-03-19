// Performance optimization utilities
import { useState, useEffect } from 'react';
import { logger } from './logger';

// Image optimization helper
export function getOptimizedImageUrl(src: string, options?: {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png';
}) {
  if (!src) return src;
  
  const { width, height, quality = 75, format = 'webp' } = options || {};
  
  // If it's already an optimized URL, return as is
  if (src.includes('?')) return src;
  
  // For local development, return original
  if (src.startsWith('/') || src.startsWith('http://localhost')) {
    return src;
  }
  
  // For external images, you could add CDN parameters here
  const params = new URLSearchParams();
  if (width) params.set('w', width.toString());
  if (height) params.set('h', height.toString());
  if (quality !== 75) params.set('q', quality.toString());
  if (format !== 'webp') params.set('f', format);
  
  const paramString = params.toString();
  return paramString ? `${src}?${paramString}` : src;
}

// Debounce utility for search and filtering
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle utility for scroll events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Lazy loading hook for components
export function useLazyLoad(
  threshold: number = 0.1,
  rootMargin: string = '50px'
) {
  const [ref, setRef] = useState<HTMLElement | null>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(ref);

    return () => {
      observer.unobserve(ref);
    };
  }, [ref, threshold, rootMargin]);

  return [setRef, isIntersecting] as const;
}

// Performance monitoring
export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Map<string, number[]> = new Map();

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  startTimer(name: string) {
    performance.mark(`${name}-start`);
  }

  endTimer(name: string) {
    performance.mark(`${name}-end`);
    performance.measure(name, `${name}-start`, `${name}-end`);
    
    const measure = performance.getEntriesByName(name, 'measure')[0];
    if (measure) {
      this.recordMetric(name, measure.duration);
    }
  }

  recordMetric(name: string, value: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    this.metrics.get(name)!.push(value);
  }

  getAverageMetric(name: string): number {
    const values = this.metrics.get(name) || [];
    if (values.length === 0) return 0;
    return values.reduce((sum, val) => sum + val, 0) / values.length;
  }

  getMetrics() {
    const result: Record<string, { average: number; min: number; max: number; count: number }> = {};
    
    this.metrics.forEach((values, name) => {
      result[name] = {
        average: this.getAverageMetric(name),
        min: Math.min(...values),
        max: Math.max(...values),
        count: values.length
      };
    });
    
    return result;
  }

  clear() {
    this.metrics.clear();
    performance.clearMarks();
    performance.clearMeasures();
  }
}

// Memory usage monitoring
export function getMemoryUsage() {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    return {
      used: Math.round(memory.usedJSHeapSize / 1048576), // MB
      total: Math.round(memory.totalJSHeapSize / 1048576), // MB
      limit: Math.round(memory.jsHeapSizeLimit / 1048576), // MB
      percentage: Math.round((memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100)
    };
  }
  return null;
}

// Critical resource preloading
export function preloadCriticalResources(resources: string[]) {
  resources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource;
    
    if (resource.endsWith('.css')) {
      link.as = 'style';
    } else if (resource.endsWith('.js')) {
      link.as = 'script';
    } else if (resource.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
      link.as = 'image';
    } else if (resource.match(/\.(woff|woff2|ttf|eot)$/)) {
      link.as = 'font';
      link.crossOrigin = 'anonymous';
    }
    
    document.head.appendChild(link);
  });
}

// Service worker registration for caching
export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      logger.info('Service Worker registered');
      return registration;
    } catch (error) {
      logger.warn('Service Worker registration failed');
      return null;
    }
  }
  return null;
}

// Cache management
export class CacheManager {
  private static instance: CacheManager;
  private cacheName = 'property-app-cache-v1';

  static getInstance() {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  async cache(urls: string[]) {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      await cache.addAll(urls);
      logger.debug(`Cached ${urls.length} resources`);
    }
  }

  async getCached(url: string): Promise<Response | null> {
    if ('caches' in window) {
      const cache = await caches.open(this.cacheName);
      return await cache.match(url) || null;
    }
    return null;
  }

  async clearCache() {
    if ('caches' in window) {
      await caches.delete(this.cacheName);
      logger.debug('Cache cleared');
    }
  }
}

// Bundle size monitoring
export function getBundleSize() {
  const scripts = Array.from(document.querySelectorAll('script[src]'));
  const styles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
  
  const scriptSizes = scripts.map(script => ({
    src: script.getAttribute('src'),
    type: 'script'
  }));
  
  const styleSizes = styles.map(style => ({
    href: style.getAttribute('href'),
    type: 'style'
  }));
  
  return {
    scripts: scriptSizes,
    styles: styleSizes,
    total: scriptSizes.length + styleSizes.length
  };
}

// Network speed detection
export function getNetworkSpeed(): Promise<{ effectiveType: string; downlink: number; rtt: number }> {
  return new Promise((resolve) => {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      resolve({
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 0,
        rtt: connection.rtt || 0
      });
    } else {
      // Fallback: estimate based on a simple test
      const startTime = performance.now();
      fetch('/api/health', { method: 'HEAD' })
        .then(() => {
          const endTime = performance.now();
          const rtt = endTime - startTime;
          resolve({
            effectiveType: rtt < 200 ? '4g' : rtt < 500 ? '3g' : '2g',
            downlink: 0,
            rtt: Math.round(rtt)
          });
        })
        .catch(() => {
          resolve({
            effectiveType: 'unknown',
            downlink: 0,
            rtt: 0
          });
        });
    }
  });
}

// Resource loading optimization
export function optimizeResourceLoading() {
  // Defer non-critical images
  const images = document.querySelectorAll('img[data-defer]');
  images.forEach(img => {
    const imageElement = img as HTMLImageElement;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const src = imageElement.getAttribute('data-src');
        if (src) {
          imageElement.src = src;
          imageElement.removeAttribute('data-defer');
        }
        observer.disconnect();
      }
    });
    observer.observe(imageElement);
  });

  // Preload critical resources
  const criticalResources = [
    '/api/properties',
    '/images/hero-bg.jpg'
  ];
  preloadCriticalResources(criticalResources);
}

// Initialize performance optimizations
export function initializePerformanceOptimizations() {
  // Monitor performance
  const monitor = PerformanceMonitor.getInstance();
  
  // Track page load
  window.addEventListener('load', () => {
    monitor.endTimer('page-load');
    // Page load tracking handled via performance timing API
    logger.info('Page load metrics captured.');
  });
  
  // Start page load timer
  monitor.startTimer('page-load');
  
  // Optimize resource loading
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', optimizeResourceLoading);
  } else {
    optimizeResourceLoading();
  }
  
  // Register service worker
  registerServiceWorker();
  
  // Monitor memory usage periodically
  setInterval(() => {
    const memory = getMemoryUsage();
    if (memory && memory.percentage > 80) {
      logger.warn('High memory usage detected:', memory);
    }
  }, 30000); // Check every 30 seconds
}
