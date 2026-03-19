'use client';

import { useEffect } from 'react';

export function usePropertyView(propertyId: string) {
  useEffect(() => {
    if (!propertyId) return;

    // Track property view when component mounts
    const trackView = async () => {
      try {
        await fetch('/api/property/view', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            propertyId,
          }),
        });
      } catch (error) {
        console.error('Failed to track property view:', error);
      }
    };

    // Small delay to ensure page is fully loaded
    const timer = setTimeout(trackView, 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [propertyId]);
}
