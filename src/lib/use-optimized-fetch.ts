'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseOptimizedFetchOptions {
  revalidateOnFocus?: boolean;
  revalidateOnReconnect?: boolean;
  refreshInterval?: number;
  dedupingInterval?: number;
  errorRetryCount?: number;
  errorRetryInterval?: number;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  error?: Error;
}

const cache = new Map<string, CacheEntry<any>>();

export function useOptimizedFetch<T>(
  url: string,
  options: UseOptimizedFetchOptions = {}
) {
  const {
    revalidateOnFocus = false,
    revalidateOnReconnect = true,
    refreshInterval = 0,
    dedupingInterval = 2000,
    errorRetryCount = 3,
    errorRetryInterval = 5000,
    onSuccess,
    onError,
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);

  const abortControllerRef = useRef<AbortController | null>(null);
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const refreshIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchData = useCallback(async (forceRefresh = false) => {
    // Check cache first
    const cached = cache.get(url);
    const now = Date.now();
    
    if (!forceRefresh && cached && (now - cached.timestamp) < dedupingInterval) {
      setData(cached.data);
      setError(cached.error || null);
      setIsLoading(false);
      return cached.data;
    }

    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();
    setIsValidating(true);

    try {
      const response = await fetch(url, {
        signal: abortControllerRef.current.signal,
        next: { revalidate: 60 }, // Cache for 60 seconds
        headers: {
          'Cache-Control': 'public, max-age=60',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update cache
      cache.set(url, {
        data: result,
        timestamp: now,
      });

      setData(result);
      setError(null);
      onSuccess?.(result);
      
      return result;
    } catch (err) {
      const error = err as Error;
      
      // Don't treat abort as error
      if (error.name === 'AbortError') {
        return null;
      }

      setError(error);
      onError?.(error);
      
      // Retry logic
      if (errorRetryCount > 0) {
        retryTimeoutRef.current = setTimeout(() => {
          useOptimizedFetch(url, {
            ...options,
            errorRetryCount: errorRetryCount - 1,
          });
        }, errorRetryInterval);
      }
      
      return null;
    } finally {
      setIsLoading(false);
      setIsValidating(false);
    }
  }, [url, dedupingInterval, errorRetryCount, errorRetryInterval, onSuccess, onError]);

  // Initial fetch
  useEffect(() => {
    fetchData();
    
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [fetchData]);

  // Refresh interval
  useEffect(() => {
    if (refreshInterval > 0) {
      refreshIntervalRef.current = setInterval(() => {
        fetchData(true);
      }, refreshInterval);
    }
    
    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
    };
  }, [refreshInterval, fetchData]);

  // Revalidate on focus
  useEffect(() => {
    if (!revalidateOnFocus) return;

    const handleFocus = () => {
      fetchData(true);
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidateOnFocus, fetchData]);

  // Revalidate on reconnect
  useEffect(() => {
    if (!revalidateOnReconnect) return;

    const handleOnline = () => {
      fetchData(true);
    };

    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [revalidateOnReconnect, fetchData]);

  // Manual mutate function
  const mutate = useCallback(async (newData?: T) => {
    if (newData !== undefined) {
      cache.set(url, {
        data: newData,
        timestamp: Date.now(),
      });
      setData(newData);
      setError(null);
      return newData;
    }
    
    return fetchData(true);
  }, [url, fetchData]);

  return {
    data,
    error,
    isLoading,
    isValidating,
    mutate,
  };
}

// Optimized fetch for server components
export async function optimizedFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    next: { 
      revalidate: 60, // Cache for 60 seconds
      ...options.next,
    },
    headers: {
      'Cache-Control': 'public, max-age=60',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Batch fetch for multiple URLs
export async function batchFetch<T>(
  urls: string[],
  options: RequestInit = {}
): Promise<T[]> {
  const promises = urls.map(url => optimizedFetch<T>(url, options));
  return Promise.all(promises);
}

// Prefetch function for navigation
export function prefetchUrl(url: string) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => {
      fetch(url, { 
        method: 'HEAD',
        next: { revalidate: 300 },
      });
    });
  } else {
    setTimeout(() => {
      fetch(url, { 
        method: 'HEAD',
        next: { revalidate: 300 },
      });
    }, 100);
  }
}
