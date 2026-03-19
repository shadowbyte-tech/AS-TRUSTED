'use client';

import dynamic from 'next/dynamic';

// Placeholder for future dynamic components
// This file is ready for performance optimizations when components are available

export const DynamicPlaceholder = dynamic(
  () => Promise.resolve({
    default: () => (
      <div className="animate-pulse">
        <div className="h-64 bg-gray-200 rounded-lg"></div>
      </div>
    )
  }),
  {
    ssr: false,
  }
);
