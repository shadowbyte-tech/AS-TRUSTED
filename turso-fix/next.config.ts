import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ✅ CRITICAL FIX: tells Next.js NOT to bundle @libsql/client
  // Without this, webpack tries to bundle native binaries → hanging/crash on Windows
  serverExternalPackages: ["@libsql/client"],

  webpack: (config, { isServer }) => {
    if (isServer) {
      // ✅ FIX: prevent webpack from trying to bundle libsql native modules
      config.externals = config.externals || [];
      if (Array.isArray(config.externals)) {
        config.externals.push("@libsql/client");
      }
    }
    return config;
  },
};

export default nextConfig;

// ─────────────────────────────────────────────────────────────
// IF YOUR FILE IS next.config.js (not .ts), use this instead:
//
// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   serverExternalPackages: ["@libsql/client"],
//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       config.externals = [...(config.externals || []), "@libsql/client"];
//     }
//     return config;
//   },
// };
// module.exports = nextConfig;
// ─────────────────────────────────────────────────────────────
