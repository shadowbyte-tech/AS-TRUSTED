/** @type {import('next').NextConfig} */
const nextConfig = {
  // ─── PRODUCTION SETTINGS ───────────────────────────────────────────────────
  // output: 'standalone' enables Docker/containerized deployments
  // Uncomment for Docker: output: 'standalone',
  
  serverExternalPackages: ['@libsql/client', 'bcryptjs'],
  
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
  ],

  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  // ─── SECURITY HEADERS (belt-and-suspenders with middleware) ────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-DNS-Prefetch-Control', value: 'off' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://res.cloudinary.com https://images.unsplash.com https://lh3.googleusercontent.com https://www.transparenttextures.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://api.cloudinary.com https://generativelanguage.googleapis.com",
              "frame-ancestors 'none'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ─── IMAGE OPTIMIZATION ────────────────────────────────────────────────────
  images: {
    // Local dev + production hostnames
    domains: ['localhost', '127.0.0.1'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'placehold.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.vercel.com',
        pathname: '/image/upload/**',
      },
    ],
    // Optimize image formats
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24, // 24 hours
  },

  // ─── WEBPACK ───────────────────────────────────────────────────────────────
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        '@genkit-ai/core': 'commonjs @genkit-ai/core',
        'genkit': 'commonjs genkit',
      });
    }
    return config;
  },
};

module.exports = nextConfig;