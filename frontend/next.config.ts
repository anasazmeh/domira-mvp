import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Required for Docker builds
  experimental: {
    // Reduce memory usage in Docker
  },
};

export default nextConfig;
